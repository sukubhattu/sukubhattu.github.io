class Role {
    constructor(obj) {
        let r = {
            id: Math.random().toFixed(6) * Math.pow(10, 6),
            type: obj.type,
            section: obj.section,
            x: obj.x,
            y: obj.y,
            row: obj.row,
            col: obj.col,
            w: 0,
            h: 0,
            isAnimeLenMax: false,
            isDel: false,
            isHurt: false,
        };
        Object.assign(this, r);
    }
}
