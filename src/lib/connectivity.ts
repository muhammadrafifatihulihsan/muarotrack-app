// Monitors online/offline status via NetInfo.
// Call start() once at app boot; components subscribe for updates.

type ConnectivityCallback = (isOnline: boolean) => void;

class ConnectivityMonitor {
    private listeners = new Set<ConnectivityCallback>();
    private online = false;
    private started = false;

    async start(): Promise<void> {
        if (this.started) return;
        this.started = true;

        try {
            const NetInfo = require("@react-native-community/netinfo");
            const state = await NetInfo.fetch();
            this.online = state.isConnected ?? false;
            NetInfo.addEventListener((s: any) => {
                this.online = s.isConnected ?? false;
                this.notify();
            });
        } catch {
            // Assume online if NetInfo unavailable.
            this.online = true;
        }
    }

    stop(): void {
        this.listeners.clear();
        this.started = false;
    }

    subscribe(cb: ConnectivityCallback): () => void {
        this.listeners.add(cb);
        return () => this.listeners.delete(cb);
    }

    isOnline(): boolean {
        return this.online;
    }

    private notify(): void {
        this.listeners.forEach((cb) => cb(this.online));
    }
}

export const connectivity = new ConnectivityMonitor();