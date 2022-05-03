import { APlugin, Flow } from "@flowrage/core";

declare module "@flowrage/core" {
  namespace Flow {
    namespace Custom {
      interface Properties {
        Server: Server;
      }
    }
  }
}

class Server extends APlugin {
  static config(): Flow.Plugin.External.Options {
    return {
      name: "Server",
      dependencies: [],
      package: "@flowrage/server",
    };
  }

  public Events: EventMpPool;
  public Blips: BlipMpPool;
  public Checkpoints: CheckpointMpPool;
  public Markers: MarkerMpPool;
  public Colshapes: ColshapeMpPool;
  public Dummies: DummyEntityMpPool;
  public Config: ConfigMp;
  public Labels: TextLabelMpPool;
  public Network: NetworkMp;
  public Objects: ObjectMpPool;
  public Peds: PedMpPool;
  public Pickups: PickupMpPool;
  public Players: PlayerMpPool;
  public Vehicles: VehicleMpPool;
  public World: WorldMp;

  constructor(options: Flow.Plugin.Internal.Options) {
    super(options);

    this.Blips = mp.blips;
    this.Events = mp.events;
    this.Checkpoints = mp.checkpoints;
    this.Markers = mp.markers;
    this.Colshapes = mp.colshapes;
    this.Dummies = mp.dummies;
    this.Config = mp.config;
    this.Labels = mp.labels;
    this.Network = mp.network;
    this.Objects = mp.objects;
    this.Peds = mp.peds;
    this.Pickups = mp.pickups;
    this.Players = mp.players;
    this.Vehicles = mp.vehicles;
    this.World = mp.world;
  }
  joaat(str: string): number {
    return mp.joaat(str);
  }
}

export { Server };
