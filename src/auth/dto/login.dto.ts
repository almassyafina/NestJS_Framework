import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {
    @IsNotEmpty({message: 'Email harus diisi'})
    @IsEmail()
    readonly email: string;

    @IsNotEmpty({message: 'Password harus diisi'})
    @MinLength(8,{message: 'Password harus berisikan 8 karakter'})
    readonly password: string;
}