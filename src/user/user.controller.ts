import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import knex from 'src/apis/knex/knex';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken'

@Controller('user')
export class UserController {
    @Post('/create')
    async create(@Req() req: Request, @Res() res: Response) {
        const { name, email, password } = req.body;
        if (!name) {
            return res.status(400).json({ mensagem: "É necessário informar o nome na requisição" });
        } else if (!email) {
            return res.status(400).json({ mensagem: "É necessário informar o email na requisição" });
        } else if (!password) {
            return res.status(400).json({ mensagem: "É necessário informar a senha na requisição" });
        } else {
            try {
                const encryptedPass = await bcrypt.hash(password, 10);
                const newUser = await knex('users').insert({ name, email, password: encryptedPass }).returning('*');
                const { password: _, ...userInfo } = newUser[0];
                return res.status(201).json(userInfo);
            } catch (error) {
                console.log(error.message);
                return res.status(500).json({ mensagem: "Erro interno do servidor, favor consultar o console para mais informações." });
            }
        }
    }

    @Post('/login')
    async login(@Req() req: Request, @Res() res: Response) {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ mensagem: "É necessário informar o email na requisição" });
        } else if (!password) {
            return res.status(400).json({ mensagem: "É necessário informar a senha na requisição" });
        } else {
            try {
                const userFound = await knex('users').where('email', email).returning('*');
                if (userFound.length < 1) {
                    return res.status(404).json({ mensagem: "Email ou senha incorretos." });
                } else {
                    const result = await bcrypt.compare(password, userFound[0].password);
                    if (!result) {
                        return res.status(404).json({ mensagem: "Email ou senha incorretos." });
                    } else {
                        const token = jwt.sign({ id: userFound[0].id }, process.env.JWT_KEY);
                        const { password: _, ...userInfo } = userFound[0];
                        return res.status(200).json({
                            user: userInfo,
                            token
                        });
                    }
                }
            } catch (error) {
                console.log(error.message);
                return res.status(500).json({ mensagem: "Erro interno do servidor, favor consultar o console para mais informações." });
            }
        }
    }
}