/* Routes pour les tokens - Endpoint */

import { Router, Request, Response } from "express";
import { generateToken } from "../services/token.service";
import { TokenRequestBody, TokenResponse, ErrorResponse } from "../types";

export const tokenRouter = Router(); // router de gestion express

tokenRouter.post("/token", (req: Request<{}, {}, TokenRequestBody>, res: Response<TokenResponse | ErrorResponse>) => {
    const { email } = req.body || {};

    if (!email) { // vérification du mail
        return res.status(400).json({
            error: "email requis"
        });
    }

    // Validation basique du format email avec une regex simple
    // ^ : début de chaîne
    // [^\s@]+ : un ou plusieurs caractères qui ne sont pas des espaces ou @
    // @ : le caractère @
    // [^\s@]+ : un ou plusieurs caractères qui ne sont pas des espaces ou @
    // \. : un point
    // [^\s@]+ : un ou plusieurs caractères qui ne sont pas des espaces ou @
    // $ : fin de chaîne
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: "email invalide"
        });
    }

    const token = generateToken(email);

    res.status(200).json({
        token
    });
});

