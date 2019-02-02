const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 3;
const GENESIS = {

    timestamp  : '01012011',
    data       : 'Genesis',
    lasthash   : '0',
    hash       : 'genesis hash',
    nonce      : 1,
    difficulty : INITIAL_DIFFICULTY
};

module.exports = { GENESIS, MINE_RATE }