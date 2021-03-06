class Animation {
    constructor(role, action, fps) {
        let a = {
            type: role.type,
            section: role.section,
            action: action,
            images: [],
            img: null,
            imgIdx: 0,
            count: 0,
            imgHead: null,
            imgBody: null,
            imgIdxHead: 0,
            imgIdxBody: 0,
            countHead: 0,
            countBody: 0,
            fps: fps,
        };
        Object.assign(this, a);
    }

    static new(role, action, fps) {
        let a = new this(role, action, fps);
        // dying animation of zombie
        if (action === "dying" || action === "die") {
            a.images = {
                head: [],
                body: [],
            };
            a.create(role);
        } else {
            a.create(role);
            a.images[0].onload = function () {
                role.w = this.width;
                role.h = this.height;
            };
        }
        return a;
    }
    /**
     * Create animation sequences for different actions
     */
    create(role) {
        let self = this,
            section = self.section;
        switch (self.type) {
            case "plant":
                for (
                    let i = 0;
                    i < allImg.plants[section][self.action].len;
                    i++
                ) {
                    let idx = i < 10 ? "0" + i : i,
                        path = allImg.plants[section][self.action].path;
                    // Add animation sequence in turn
                    self.images.push(imageFromPath(path.replace(/\*/, idx)));
                }
                break;
            // zombie animation
            case "zombie":
                if (self.action === "dying" || self.action === "die") {
                    for (
                        let i = 0;
                        i <
                        allImg.zombies[role.zombieType][self.action].head.len;
                        i++
                    ) {
                        let idx = i < 10 ? "0" + i : i;

                        let path =
                            allImg.zombies[role.zombieType][self.action].head
                                .path;
                        self.images.head.push(
                            imageFromPath(path.replace(/\*/, idx))
                        );
                    }

                    for (
                        let i = 0;
                        i <
                        allImg.zombies[role.zombieType][self.action].body.len;
                        i++
                    ) {
                        let idx = i < 10 ? "0" + i : i,
                            path =
                                allImg.zombies[role.zombieType][self.action]
                                    .body.path;

                        self.images.body.push(
                            imageFromPath(path.replace(/\*/, idx))
                        );
                    }
                } else {
                    for (
                        let i = 0;
                        i < allImg.zombies[role.zombieType][self.action].len;
                        i++
                    ) {
                        let idx = i < 10 ? "0" + i : i,
                            path =
                                allImg.zombies[role.zombieType][self.action]
                                    .path;

                        self.images.push(
                            imageFromPath(path.replace(/\*/, idx))
                        );
                    }
                }
                break;
            // loading animation
            case "loading":
                for (let i = 0; i < allImg.loading[self.action].len; i++) {
                    let idx = i < 10 ? "0" + i : i,
                        path = allImg.loading[self.action].path;
                    self.images.push(imageFromPath(path.replace(/\*/, idx)));
                }
                break;
        }
    }
}
