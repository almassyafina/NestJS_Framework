import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterDto {
    @IsNotEmpty({message: 'nama harus di isi'})
    readonly name: string;

    @IsNotEmpty({message: 'Email harus diisi'})
    @IsEmail({}, { message: 'Format email tidak valid' })
    readonly email: string;

    @IsNotEmpty({message: 'Password harus diisi'})
    @MinLength(8,{message: 'Password harus berisikan 8 karakter'})
    readonly password: string;


    @IsNotEmpty({message: 'Password harus diisi'})
    @MinLength(8,{message: 'Password harus berisikan 8 karakter'})
    readonly confirmPassword: string;
}