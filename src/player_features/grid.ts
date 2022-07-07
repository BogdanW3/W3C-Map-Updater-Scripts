import { showMessageOverUnit } from "utils";
import { Unit, MapPlayer, Trigger, File } from "w3ts/index";
import { Players } from "w3ts/globals/index";


let gridArray= [];
function forEachimage(action) {
    let temp = GetPlayableMapRect();
    let xdiff = GetRectMaxX(temp) - GetRectMinX(temp);
    let ydiff = GetRectMaxY(temp) - GetRectMinY(temp);
    print("hecc3");
    for (let x = GetRectMinX(temp); x < GetRectMaxX(temp); x+=128) {
        for (let y = GetRectMinY(temp); y < GetRectMaxY(temp); y+=128) {
            action(gridArray[(x-xdiff - 1)*ydiff + y], x, y);
        }
    }
}
let isGridEnabled: boolean = true
export function enableGrid() {
    const gridToggleTrigger = new Trigger()
    const fileText = File.read("w3cGrid.txt")

    if (fileText) {
        isGridEnabled = (fileText == "true")
    }

    for (let i = 0; i < bj_MAX_PLAYERS; i++) {
        gridToggleTrigger.registerPlayerChatEvent(MapPlayer.fromHandle(Player(i)), "-grid", true)
    }

    gridToggleTrigger.addAction(() => {
        let triggerPlayer = MapPlayer.fromEvent()
        let localPlayer = MapPlayer.fromLocal()

        // Making sure that enable/disable only if the local player is the one who called the command
        if (triggerPlayer.handle != localPlayer.handle)
        return

        isGridEnabled = !isGridEnabled
        DisplayTextToPlayer(triggerPlayer.handle, 0, 0, `\n|cff00ff00[W3C]:|r Showing a|cffffff00 grid|r when placing down buildings is now |cffffff00 ` + (isGridEnabled ? `ENABLED` : `DISABLED`) + `|r.`)
        File.write("w3cGrid.txt", isGridEnabled.toString())
    })

    const gridOnTrigger = new Trigger()
    gridOnTrigger.registerGameEvent(EVENT_GAME_BUILD_SUBMENU); // This event is local.
    gridOnTrigger.addCondition(() => isGridEnabled);
    gridOnTrigger.addAction(() => {
        print("HECC");
        forEachimage((image) => {
            SetImageColor(image, 255, 255, 255, 255);
        })   
        gridOffTrigger.enabled = true;
    })

    const gridOffTrigger = new Trigger();
    for (let i = 0; i < bj_MAX_PLAYERS; i++) {
        if (GetPlayerSlotState(Player(i)) == PLAYER_SLOT_STATE_PLAYING) {
            TriggerRegisterPlayerEventEndCinematic(gridOffTrigger.handle, Player(i));
            gridOffTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER);
            gridOffTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER);
            gridOffTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_ORDER);
            //gridOffTrigger.registerPlayerMouseEvent(MapPlayer.fromHandle(Player(i)), bj_MOUSEEVENTTYPE_DOWN);
        }
    }
    gridOffTrigger.addAction(() => {
        let triggerPlayer = MapPlayer.fromEvent()
        let localPlayer = MapPlayer.fromLocal()

        // Making sure that enable/disable only if the local player is the one who called the command
        if (triggerPlayer.handle != localPlayer.handle)
        return
        print("HECC2");
        forEachimage((image) => {
            SetImageColor(image, 255, 255, 255, 0);
        })
        
        gridOffTrigger.enabled = false;
    })
    gridOffTrigger.enabled = false;
    forEachimage((image, x, y) => {
        image = CreateImage("Gridplane.dds",128,128,0,0,0,0,1,1,1,1);
        SetImageRenderAlways(image, true);
        SetImageColor(image, 255, 255, 255, 0);
        SetImagePosition(image, x, y, 256);
    });
}
