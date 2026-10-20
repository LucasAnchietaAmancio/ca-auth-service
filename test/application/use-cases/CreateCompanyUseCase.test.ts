import { jest } from "@jest/globals";
import CreateCompanyUseCase from "@use-cases/CreateCompanyUseCase.js";
import CompanyEntity from "@entities/CompanyEntity.js";
import UserAlreadyExists from "@exceptions/UserAlreadyExists.js";
import type CompanyRepositoryPort from "@ports/out/CompanyRepositoryPort.js";
import type CryptoHashAdapterPort from "@ports/out/EncryptAdapterPort.js";

describe("CreateCompanyUseCase", () => {
    it("Deve criar uma empresa com a senha encriptada", async () => {
        const companyRepository: jest.Mocked<CompanyRepositoryPort> = {
            findById: jest.fn<CompanyRepositoryPort["findById"]>(),
            findByEmail: jest.fn<CompanyRepositoryPort["findByEmail"]>().mockResolvedValue(null),
            save: jest.fn<CompanyRepositoryPort["save"]>().mockResolvedValue(undefined),
        };
        const cryptoAdapter: jest.Mocked<CryptoHashAdapterPort> = {
            encrypt: jest.fn<CryptoHashAdapterPort["encrypt"]>()
                .mockReturnValueOnce("encrypted_password")
                .mockReturnValueOnce("encrypted_totp_secret"),
            decrypt: jest.fn<CryptoHashAdapterPort["decrypt"]>(),
        };
        const createCompanyUseCase = new CreateCompanyUseCase(companyRepository, cryptoAdapter);

        const companyId = await createCompanyUseCase.execute({
            companyName: "Empresa Teste",
            email: "  Email@Teste.Com  ",
            password: "Hashed!@Password123",
            totpSecret: "JBSWY3DPEBLW64TMMQQQ",
        });

        expect(companyId).toBeDefined();
        expect(cryptoAdapter.encrypt).toHaveBeenCalledWith("Hashed!@Password123");
        expect(cryptoAdapter.encrypt).toHaveBeenCalledWith("JBSWY3DPEBLW64TMMQQQ");
        expect(companyRepository.findByEmail).toHaveBeenCalledWith("email@teste.com");
        expect(companyRepository.save).toHaveBeenCalledWith(expect.any(CompanyEntity));
        const savedCompany = companyRepository.save.mock.calls[0]?.[0];
        expect(savedCompany?.email).toBe("email@teste.com");
        expect(savedCompany?.password).toBe("encrypted_password");
        expect(savedCompany?.totpSecret).toBe("encrypted_totp_secret");
    });

    it("Deve retornar um erro caso a empresa já exista", async () => {
        const companyRepository: jest.Mocked<CompanyRepositoryPort> = {
            findById: jest.fn<CompanyRepositoryPort["findById"]>(),
            findByEmail: jest.fn<CompanyRepositoryPort["findByEmail"]>().mockResolvedValue(CompanyEntity.create(
                "Empresa Teste",
                "email@teste.com",
                "Hashed!@Password123",
                "JBSWY3DPEBLW64TMMQQQ",
            )),
            save: jest.fn<CompanyRepositoryPort["save"]>(),
        };
        const cryptoAdapter: jest.Mocked<CryptoHashAdapterPort> = {
            encrypt: jest.fn<CryptoHashAdapterPort["encrypt"]>(),
            decrypt: jest.fn<CryptoHashAdapterPort["decrypt"]>(),
        };
        const createCompanyUseCase = new CreateCompanyUseCase(companyRepository, cryptoAdapter);

        await expect(createCompanyUseCase.execute({
            companyName: "Empresa Teste",
            email: "email@teste.com",
            password: "Hashed!@Password123",
            totpSecret: "JBSWY3DPEBLW64TMMQQQ",
        })).rejects.toThrow(UserAlreadyExists);
    });
});
