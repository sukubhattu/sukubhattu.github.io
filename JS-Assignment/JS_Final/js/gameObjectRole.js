class Role {
    constructor(obj) {
        let r = {
            // Randomly generated id value, used to set the current role ID
            id: Math.random().toFixed(6) * Math.pow(10, 6),
            // Character type (plant or zombie)
            type: obj.type,
            // Character category
            section: obj.section,
            x: obj.x,
            y: obj.y,
            // Character initialization line coordinates
            row: obj.row,
            // Character initialization column coordinates
            col: obj.col,
            w: 0,
            h: 0,
            isAnimeLenMax: false,
            // Determine whether to die and remove the current character
            isDel: false,
            // Determine if you are injured
            isHurt: false,
        };
        Object.assign(this, r);
    }
}
