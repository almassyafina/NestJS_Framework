import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {

    private users: {
        id: number;
        name: string;
        email: string;
        password: string;
    }[] = [];

    findByEmail(email: string) {
        return this.users.find(
            user => user.email === email
        );
    }

    create(data: {
        name: string;
        email: string;
        password: string;
    }) {
        const newUser = {
            id: this.users.length + 1,
            name: data.name,
            email: data.email,
            password: data.password,
        };

        this.users.push(newUser);

        return {
            message: 'Register berhasil',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
        };
    }

    update(
        id: number,
        data: {
            password?: string;
        }
    ) {
        const user = this.users.find(
            user => user.id === id
        );

        if (!user) {
            return null;
        }

        if (data.password) {
            user.password = data.password;
        }

        return user;
    }
}