#! /usr/bin/env node

const { createServer } = require("vite");

// 可运行的脚本
// console.log('run changhe-vite')
const createServers = require('../index')
createServers().listen(8000,()=>{
    console.log('server running on localhost:8000')
})