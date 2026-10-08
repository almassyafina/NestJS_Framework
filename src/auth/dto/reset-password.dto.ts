export class ResetPasswordDto {
    readonly token: string;
    readonly newPassword: string;
    readonly confirmNewPassword: string;
}