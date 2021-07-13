"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const msg_router = express_1.Router();
msg_router.get('/', (req, res) => {
    return res.json({
        ok: true,
        msg: 'GET - Ready'
    });
});
msg_router.post('/', (req, res) => {
    const { from, body } = req.body;
    return res.json({
        ok: true,
        msg: 'POST - Ready',
        from,
        body
    });
});
msg_router.post('/:id', (req, res) => {
    const { from, body } = req.body;
    const { id } = req.params;
    return res.json({
        ok: true,
        msg: 'POST - Ready',
        from,
        body,
        id
    });
});
exports.default = msg_router;
