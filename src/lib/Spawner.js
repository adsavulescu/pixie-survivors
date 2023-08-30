export default class Spawner {
    constructor(maxSpawns, spawnInterval, {create}) {
        this.spawnInterval = spawnInterval;

        this.maxSpawns = maxSpawns;

        this.create = create;

        this.spawns = [];

        setInterval(() => this.spawn(), this.spawnInterval);
    }

    spawn() {
        if(this.spawns.length >= this.maxSpawns) return;

        let s = this.create();
        this.spawns.push(s);
    }
}
