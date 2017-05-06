// @flow

const table = [
    ['NOP', 'BR r8', 'LD d9', 'LD d9', 'LD @Ri', 'LD @Ri', 'LD @Ri', 'LD @Ri', 'CALL a12', 'CALL a12', 'CALL a12', 'CALL a12', 'CALL a12', 'CALL a12', 'CALL a12', 'CALL a12'],
    ['CALLR r16', 'BRF r16', 'ST d9', 'ST d9', 'ST @Ri', 'ST @Ri', 'ST @Ri', 'ST @Ri', 'CALL a12', 'CALL a12', 'CALL a12', 'CALL a12', 'CALL a12', 'CALL a12', 'CALL a12', 'CALL a12'],
    ['CALLF a16', 'JMPF a16', 'MOV #i8,d9', 'MOV #i8,d9', 'MOV #i8,@Ri', 'MOV #i8,@Ri', 'MOV #i8,@Ri', 'MOV #i8,@Ri', 'JMP a12', 'JMP a12', 'JMP a12', 'JMP a12', 'JMP a12', 'JMP a12', 'JMP a12', 'JMP a12'],
    ['MUL', 'BE #i8,r8', 'BE d9,r8', 'BE d9,r8', 'BE @Ri,#i8,r8', 'BE @Ri,#i8,r8', 'BE @Ri,#i8,r8', 'BE @Ri,#i8,r8', 'JMP a12', 'JMP a12', 'JMP a12', 'JMP a12', 'JMP a12', 'JMP a12', 'JMP a12', 'JMP a12'],
    ['DIV', 'BNE #i8,r8', 'BNE d9,r8', 'BNE d9,r8', 'BNE @Ri,#i8,r8', 'BNE @Ri,#i8,r8', 'BNE @Ri,#i8,r8', 'BNE @Ri,#i8,r8', 'BPC d9,b3,r8', 'BPC d9,b3,r8', 'BPC d9,b3,r8', 'BPC d9,b3,r8', 'BPC d9,b3,r8', 'BPC d9,b3,r8', 'BPC d9,b3,r8', 'BPC d9,b3,r8'],
    [null, null, 'DBNZ d9,r8', 'DBNZ d9,r8', 'DBNZ @Ri,r8', 'DBNZ @Ri,r8', 'DBNZ @Ri,r8', 'DBNZ @Ri,r8', 'BPC d9,b3,r8', 'BPC d9,b3,r8', 'BPC d9,b3,r8', 'BPC d9,b3,r8', 'BPC d9,b3,r8', 'BPC d9,b3,r8', 'BPC d9,b3,r8', 'BPC d9,b3,r8'],
    ['PUSH d9', 'PUSH d9', 'INC d9', 'INC d9', 'INC @Ri', 'INC @Ri', 'INC @Ri', 'INC @Ri', 'BP d9,b3,r8', 'BP d9,b3,r8', 'BP d9,b3,r8', 'BP d9,b3,r8', 'BP d9,b3,r8', 'BP d9,b3,r8', 'BP d9,b3,r8', 'BP d9,b3,r8'],
    ['POP d9', 'POP d9', 'DEC d9', 'DEC d9', 'DEC @Ri', 'DEC @Ri', 'DEC @Ri', 'DEC @Ri', 'BP d9,b3,r8', 'BP d9,b3,r8', 'BP d9,b3,r8', 'BP d9,b3,r8', 'BP d9,b3,r8', 'BP d9,b3,r8', 'BP d9,b3,r8', 'BP d9,b3,r8'],
    ['BZ r8', 'ADD #i8', 'ADD d9', 'ADD d9', 'ADD @Ri', 'ADD @Ri', 'ADD @Ri', 'ADD @Ri', 'BN d9,b3,r8', 'BN d9,b3,r8', 'BN d9,b3,r8', 'BN d9,b3,r8', 'BN d9,b3,r8', 'BN d9,b3,r8', 'BN d9,b3,r8', 'BN d9,b3,r8'],
    ['BZ r8', 'ADDC #i8', 'ADDC d9', 'ADDC d9', 'ADDC @Ri', 'ADDC @Ri', 'ADDC @Ri', 'ADDC @Ri', 'BN d9,b3,r8', 'BN d9,b3,r8', 'BN d9,b3,r8', 'BN d9,b3,r8', 'BN d9,b3,r8', 'BN d9,b3,r8', 'BN d9,b3,r8', 'BN d9,b3,r8'],
    ['RET', 'SUB #i8', 'SUB d9', 'SUB d9', 'SUB @Ri', 'SUB @Ri', 'SUB @Ri', 'SUB @Ri', 'NOT1 d9,b3', 'NOT1 d9,b3', 'NOT1 d9,b3', 'NOT1 d9,b3', 'NOT1 d9,b3', 'NOT1 d9,b3', 'NOT1 d9,b3', 'NOT1 d9,b3'],
    ['RETI', 'SUBC #i8', 'SUBC d9', 'SUBC d9', 'SUBC @Ri', 'SUBC @Ri', 'SUBC @Ri', 'SUBC @Ri', 'NOT1 d9,b3', 'NOT1 d9,b3', 'NOT1 d9,b3', 'NOT1 d9,b3', 'NOT1 d9,b3', 'NOT1 d9,b3', 'NOT1 d9,b3', 'NOT1 d9,b3'],
    ['ROR', 'LDC', 'XCH d9', 'XCH d9', 'XCH @Ri', 'XCH @Ri', 'XCH @Ri', 'XCH @Ri', 'CLR1 d9,b3', 'CLR1 d9,b3', 'CLR1 d9,b3', 'CLR1 d9,b3', 'CLR1 d9,b3', 'CLR1 d9,b3', 'CLR1 d9,b3', 'CLR1 d9,b3'],
    ['RORC', 'OR #i8', 'OR d9', 'OR d9', 'OR @Ri', 'OR @Ri', 'OR @Ri', 'OR @Ri', 'CLR1 d9,b3', 'CLR1 d9,b3', 'CLR1 d9,b3', 'CLR1 d9,b3', 'CLR1 d9,b3', 'CLR1 d9,b3', 'CLR1 d9,b3', 'CLR1 d9,b3'],
    ['ROL', 'AND #i8', 'AND d9', 'AND d9', 'AND @Ri', 'AND @Ri', 'AND @Ri', 'AND @Ri', 'SET1 d9,b3', 'SET1 d9,b3', 'SET1 d9,b3', 'SET1 d9,b3', 'SET1 d9,b3', 'SET1 d9,b3', 'SET1 d9,b3', 'SET1 d9,b3'],
    ['ROLC', 'XOR #i8', 'XOR d9', 'XOR d9', 'XOR @Ri', 'XOR @Ri', 'XOR @Ri', 'XOR @Ri', 'SET1 d9,b3', 'SET1 d9,b3', 'SET1 d9,b3', 'SET1 d9,b3', 'SET1 d9,b3', 'SET1 d9,b3', 'SET1 d9,b3', 'SET1 d9,b3']
];

module.exports = (opcode: number) => {
    const hi = (opcode >>> 4) & 0xf;
    const lo = (opcode >>> 0) & 0xf;

    return table[hi][lo];
};