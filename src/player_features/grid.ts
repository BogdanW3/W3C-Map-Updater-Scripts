import { File, MapPlayer, Trigger } from "w3ts/index";

let gridTiles = []
let isGridEnabled = true;
let isGridOn = false;

export function enableGrid()
{
    let toggleGrid = CreateTrigger();
    for (let i = 0; i < bj_MAX_PLAYERS; i++) {
        let isLocalPlayer = MapPlayer.fromHandle(Player(i)).name == MapPlayer.fromLocal().name;
        if (isLocalPlayer) {
            const fileText = File.read("w3cGrid.txt")

            if (fileText) {
                isGridEnabled = (fileText == "true");
            }
        }
        TriggerRegisterPlayerChatEvent(toggleGrid, Player(i), "-grid", true);
    }

    TriggerAddAction(toggleGrid, () => {
        let triggerPlayer = MapPlayer.fromEvent()
        let localPlayer = MapPlayer.fromLocal()

        // Making sure that enable/disable only if the local player is the one who called the command
        if (triggerPlayer.name != localPlayer.name)
            return

        isGridEnabled = !isGridEnabled
        DisplayTextToPlayer(triggerPlayer.handle, 0, 0, `\n|cff00ff00[W3C]:|r Grid is now |cffffff00 ` + (isGridEnabled ? `ENABLED` : `DISABLED`) + `|r.`)

        for (let i = 0; i < gridTiles.length; i++) {
            SetImageRenderAlways(gridTiles[i], isGridEnabled && isGridOn);
        }
        File.write("w3cMinimapIcons.txt", isGridEnabled.toString());
    });
    

    let minX = GetRectMinX(GetPlayableMapRect());
    let minY = GetRectMinY(GetPlayableMapRect());
    let maxX = GetRectMaxX(GetPlayableMapRect());
    let maxY = GetRectMaxY(GetPlayableMapRect());

    let gridWidth = Math.ceil((maxX - minX) / 128);
    let gridHeight = Math.ceil((maxY - minY) / 128);

    
    for (let iy = 0; iy < 2*gridHeight; iy++) {
        for (let ix = 0; ix < 2*gridWidth; ix++) {
            let x = minX + ix * 64;
            let y = minY + iy * 64;

            let icon = CreateImage("Gridplane.dds", 68, 68, 0, x - 2, y - 2, 0, 0, 0, 0, 1);
            gridTiles.push(icon);
            SetImageRenderAlways(icon, false);
            SetImageColor(icon, 120, 130, 230, 100);
        }
    };

    let gridUpdate = new Trigger();
    gridUpdate.registerPlayerKeyEvent(MapPlayer.fromLocal(), OSKEY_OEM_2, 0, true);
    gridUpdate.addAction(() => {
        isGridOn = !isGridOn;
        for (let i = 0; i < gridTiles.length; i++) {
            SetImageRenderAlways(gridTiles[i], isGridEnabled && isGridOn);
        }
    });
}