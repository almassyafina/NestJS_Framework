import { IsInt, IsNotEmpty } from "class-validator";

export class CreateBookDto {
    @IsNotEmpty({message: 'Title harus diisi'})
    readonly title: string;

    @IsNotEmpty({message: 'Author harus diisi'})
    readonly author: string;

    @IsNotEmpty({message: 'ISBN harus diisi'})
    readonly isbn: string;

    @IsNotEmpty({message: 'Published Year harus diisi'})
    @IsInt({message: 'Publushed Year harus diisi'})
    readonly publishedYear: number;
}