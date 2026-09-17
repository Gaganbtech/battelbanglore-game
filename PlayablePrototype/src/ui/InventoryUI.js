// Tactical Military Grid Inventory UI for Bengaluru: Last City
// Displays equipped gear slots, weapon attachments, medical consumables, and backpack capacity
export class InventoryUI {
  constructor(audioManager) {
    this.audioManager = audioManager;
    this.isOpen = false;

    this.container = document.createElement('div');
    this.container.id = 'tactical-inventory-overlay';
    this.container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(10, 15, 29, 0.88);
      backdrop-filter: blur(10px);
      z-index: 200;
      display: none;
      justify-content: center;
      align-items: center;
      font-family: 'Rajdhani', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      user-select: none;
    `;

    this.container.innerHTML = `
      <div style="width: 880px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; box-shadow: 0 16px 40px rgba(0,0,0,0.8); overflow: hidden; display: flex; flex-direction: column;">
        <!-- Header -->
        <div style="background: #1e293b; padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 10px; height: 10px; background: #ffb300; border-radius: 50%;"></div>
            <h2 style="margin: 0; color: #f8fafc; font-size: 18px; letter-spacing: 1.5px; font-weight: 700; text-transform: uppercase;">Tactical Field Loadout</h2>
          </div>
          <div style="color: #94a3b8; font-size: 13px; font-weight: 600;">BACKPACK: <span id="inv-capacity" style="color: #38bdf8;">85 / 200</span></div>
        </div>

        <!-- Main Content (2-Column Grid) -->
        <div style="display: flex; padding: 24px; gap: 24px;">
          <!-- Left: Equipped Gear Slots -->
          <div style="flex: 1.2; display: flex; flex-direction: column; gap: 14px;">
            <div style="color: #64748b; font-size: 12px; font-weight: 700; letter-spacing: 1px;">EQUIPPED WEAPON SLOTS</div>
            
            <!-- Primary Slot -->
            <div style="background: #1e293b; border: 1px solid #475569; border-radius: 6px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="color: #94a3b8; font-size: 11px; font-weight: 600;">PRIMARY WEAPON [1]</div>
                <div id="inv-primary-name" style="color: #f8fafc; font-size: 16px; font-weight: 700; margin-top: 2px;">AR-9 Bangalore Special</div>
                <div style="color: #38bdf8; font-size: 12px; margin-top: 2px;">5.56mm NATO • Full Auto</div>
              </div>
              <div style="background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; color: #38bdf8; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 700;">EQUIPPED</div>
            </div>

            <!-- Secondary Slot -->
            <div style="background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="color: #94a3b8; font-size: 11px; font-weight: 600;">SECONDARY WEAPON [2]</div>
                <div id="inv-secondary-name" style="color: #cbd5e1; font-size: 15px; font-weight: 600; margin-top: 2px;">Pulse-9 SMG</div>
                <div style="color: #94a3b8; font-size: 12px; margin-top: 2px;">9mm Parabellum • Burst</div>
              </div>
              <button id="btn-equip-secondary" style="background: #334155; border: none; color: #f8fafc; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-weight: 600; font-size: 12px;">SWITCH [2]</button>
            </div>

            <!-- Armor & Helmet Status -->
            <div style="color: #64748b; font-size: 12px; font-weight: 700; letter-spacing: 1px; margin-top: 8px;">PROTECTIVE GEAR</div>
            <div style="display: flex; gap: 12px;">
              <div style="flex: 1; background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 12px;">
                <div style="color: #94a3b8; font-size: 11px; font-weight: 600;">BALLISTIC HELMET</div>
                <div id="inv-helmet-name" style="color: #f8fafc; font-size: 14px; font-weight: 700; margin-top: 2px;">Level 2 SpecOps</div>
                <div id="inv-helmet-dur" style="color: #22c55e; font-size: 12px; margin-top: 2px;">Durability: 100% (-40%)</div>
              </div>
              <div style="flex: 1; background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 12px;">
                <div style="color: #94a3b8; font-size: 11px; font-weight: 600;">BODY ARMOR VEST</div>
                <div id="inv-armor-name" style="color: #f8fafc; font-size: 14px; font-weight: 700; margin-top: 2px;">Level 2 Commando</div>
                <div id="inv-armor-dur" style="color: #22c55e; font-size: 12px; margin-top: 2px;">Durability: 100% (-30%)</div>
              </div>
            </div>
          </div>

          <!-- Right: Backpack Contents & Consumables -->
          <div style="flex: 1; display: flex; flex-direction: column; gap: 14px;">
            <div style="color: #64748b; font-size: 12px; font-weight: 700; letter-spacing: 1px;">BACKPACK STORAGE</div>
            
            <div style="background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
              <!-- First Aid Kit -->
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #2d3748; padding-bottom: 8px;">
                <div>
                  <div style="color: #f8fafc; font-weight: 600; font-size: 14px;">Trauma First Aid Kit</div>
                  <div style="color: #94a3b8; font-size: 11px;">Restores 75 HP (x1)</div>
                </div>
                <button id="btn-use-firstaid" style="background: #0284c7; border: none; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer;">USE [7]</button>
              </div>

              <!-- Energy Drink -->
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #2d3748; padding-bottom: 8px;">
                <div>
                  <div style="color: #f8fafc; font-weight: 600; font-size: 14px;">Bengaluru Rush Energy Drink</div>
                  <div style="color: #94a3b8; font-size: 11px;">+40% Boost & Speed (x2)</div>
                </div>
                <button id="btn-use-drink" style="background: #059669; border: none; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer;">USE [8]</button>
              </div>

              <!-- Bandages -->
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="color: #f8fafc; font-weight: 600; font-size: 14px;">Sterile Bandages</div>
                  <div style="color: #94a3b8; font-size: 11px;">+10 HP per use (x5)</div>
                </div>
                <button id="btn-use-bandage" style="background: #475569; border: none; color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer;">USE [9]</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer / Close hint -->
        <div style="background: #0b1120; padding: 10px 24px; color: #64748b; font-size: 12px; text-align: right; border-top: 1px solid #1e293b;">
          PRESS <kbd style="background: #1e293b; color: #e2e8f0; padding: 2px 6px; border-radius: 3px; border: 1px solid #334155;">TAB</kbd> OR <kbd style="background: #1e293b; color: #e2e8f0; padding: 2px 6px; border-radius: 3px; border: 1px solid #334155;">ESC</kbd> TO CLOSE
        </div>
      </div>
    `;

    document.body.appendChild(this.container);
    this.setupEvents();
  }

  setupEvents() {
    const btnFirstAid = this.container.querySelector('#btn-use-firstaid');
    if (btnFirstAid) {
      btnFirstAid.onclick = () => {
        if (this.onUseItem) this.onUseItem('firstAid');
      };
    }

    const btnDrink = this.container.querySelector('#btn-use-drink');
    if (btnDrink) {
      btnDrink.onclick = () => {
        if (this.onUseItem) this.onUseItem('energyDrink');
      };
    }
  }

  toggle(playerState) {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show(playerState);
    }
  }

  show(playerState) {
    this.isOpen = true;
    this.container.style.display = 'flex';
    this.updateDisplay(playerState);
    if (this.audioManager) this.audioManager.playUIBeep(640);
  }

  hide() {
    this.isOpen = false;
    this.container.style.display = 'none';
  }

  updateDisplay(playerState) {
    if (!playerState) return;

    const helmName = this.container.querySelector('#inv-helmet-name');
    const helmDur = this.container.querySelector('#inv-helmet-dur');
    if (helmName && helmDur) {
      helmName.textContent = playerState.helmetLevel > 0 ? `Level ${playerState.helmetLevel} Helmet` : 'No Helmet';
      helmDur.textContent = `Durability: ${Math.round(playerState.helmetDurability)}%`;
    }

    const armorName = this.container.querySelector('#inv-armor-name');
    const armorDur = this.container.querySelector('#inv-armor-dur');
    if (armorName && armorDur) {
      armorName.textContent = playerState.armorLevel > 0 ? `Level ${playerState.armorLevel} Vest` : 'No Armor';
      armorDur.textContent = `Durability: ${Math.round(playerState.armorDurability)}%`;
    }
  }
}
