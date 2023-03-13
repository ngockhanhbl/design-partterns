class PlayerContext {
    private state: State;
    private playing = false;
    private playlist = [] as Array<string>;
    private currentTrack = 0;
   
    constructor() {
        this.state = new StateReady(this);
        this.setPlaying(true);
        for (let i = 0; i < 10; i++) {
            this.playlist.push("Track " + i);
        }
    }

    public setState(state: State): void {
        console.log(`Context: Transition to ${(<any>state).constructor.name}.`);
        this.state = state;
        this.state.setContext(this);
    }

    public getState(): State {
        return this.state;
    }

    public setPlaying(playing: boolean): void {
        this.playing = playing;
    }

    public isPlaying(): boolean  {
        return this.playing;
    }

    public startPlayback(): string {
        return "Playing " + this.playlist[this.currentTrack];
    }

    public nextTrack(): string {
        this.currentTrack++;
        if (this.currentTrack > this.playlist.length - 1) {
            this.currentTrack = 0;
        }
        return "Playing " + this.playlist[this.currentTrack];
    }

    public previousTrack(): string {
        this.currentTrack--;
        if (this.currentTrack < 0) {
            this.currentTrack = this.playlist.length - 1;
        }
        return "Playing " + this.playlist[this.currentTrack];
    }

    public setCurrentTrackAfterStop(): void {
        this.currentTrack = 0;
    }
}

abstract class State {
    protected player: PlayerContext;

    constructor(player: PlayerContext) {
        this.player = player;
    }

    public setContext(context: PlayerContext) {
        this.player = context;
    }

    public abstract onLock(): string;

    public abstract onPlay(): string;

    public abstract onNext(): string;

    public abstract onPrevious(): string;
}

class StateReady extends State {
    public onLock(): string {
        player.setState(new LockedState(player));
        return "Locked...";
    }
    public onPlay(): string {
        const action = player.startPlayback();
        player.setState(new PlayingState(player));
        return action;
    }
    public onNext(): string {
        return "Locked...";
    }
    public onPrevious(): string {
        return "Locked...";
    }
    
}

class LockedState extends State {
    public onLock(): string {
        if (player.isPlaying()) {
            player.setState(new StateReady(player));
            return "Stop playing";
        } else {
            return "Locked...";
        }
    }
    public onPlay(): string {
        player.setState(new StateReady(player));
        return "Ready";
    }
    public onNext(): string {
        return "Locked..";
    }
    public onPrevious(): string {
        return "Locked..";
    } 
}

class PlayingState extends State {
    public onLock(): string {
        player.setState(new LockedState(player));
        player.setCurrentTrackAfterStop();
        return "Stop playing";
    }

    public onPlay(): string {
        player.setState(new StateReady(player));
        return "Paused...";
    }
    public onNext(): string {
        return player.nextTrack();
    }
    public onPrevious(): string {
        return player.previousTrack();
    }
}
var result = '';
const player = new PlayerContext();

// user press play
player.getState().onPlay();
setTimeout(() => {
    result = player.getState().onNext();
    console.log(result)
}, 1000)

setTimeout(() => {
    result = player.getState().onNext();
    console.log(result)
}, 2000)

// user press previous
setTimeout(() => {
    result =player.getState().onPrevious();
    console.log(result)
}, 3000)

// user press pause
setTimeout(() => {
    result =player.getState().onLock();
    console.log(result)
}, 5000)