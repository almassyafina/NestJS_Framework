
import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    IsBoolean,
    IsUUID,
    IsOptional,
    Min,
} from "class-validator";

export class CreateBookDto {
    @IsNotEmpty({ message: 'Title harus diisi' })
    @IsString()
    readonly title: string;

    @IsNotEmpty({ message: 'Author harus diisi' })
    @IsString()
    readonly author: string;

    @IsNotEmpty({ message: 'ISBN harus diisi' })
    @IsString()
    readonly isbn: string;

    @IsNotEmpty({ message: 'Published Year harus diisi' })
    @IsInt({ message: 'Published Year harus berupa angka bulat' })
    readonly publishedYear: number;

    @IsOptional()
    @IsBoolean()
    readonly isAvailable?: boolean;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    readonly price: number;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    readonly stock: number;

    @IsNotEmpty()
    @IsUUID()
    readonly categoryId: string;

    @IsNotEmpty()
    @IsUUID()
    readonly publisherId: string;
}
