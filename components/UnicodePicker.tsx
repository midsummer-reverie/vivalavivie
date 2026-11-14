'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const GROUPS: Record<string, { label: string; chars: string }> = {
  '😀 อารมณ์': { label: '😀 หน้ายิ้มและอารมณ์', chars: '😀 😃 😄 😁 😆 😅 😂 🙂 🙃 😉 😊 😇 🥰 😍 🤩 😘 😋 😛 😜 🤪 🤗 🤭 🫢 🫣 🤫 🤔 🫡 😐 😑 😶 😏 🙄 😬 😌 😔 😪 😴 🥱 😷 🤒 🤢 🤮 🥵 🥶 🥴 😵 🤯 🥳 😎 🤓 😕 😟 🙁 ☹️ 😮 😯 😲 😳 🥺 🥹 😦 😨 😰 😥 😢 😭 😱 😖 😣 😞 😩 😫 😤 😡 😠 🤬 😈 👿 💀 ☠️ 💩 🤡 👻 👽 👾 🤖' },
  '🧑 คน': { label: '🧑 คนและร่างกาย', chars: '👋 🤚 🖐️ ✋ 🖖 🫱 🫲 🫳 🫴 👌 🤌 🤏 ✌️ 🤞 🫰 🤟 🤘 🤙 👈 👉 👆 🖕 👇 ☝️ 👍 👎 ✊ 👊 🤛 🤜 👏 🙌 🫶 👐 🤲 🤝 🙏 ✍️ 💅 🤳 💪 🦾 🦿 🦵 🦶 👂 🦻 👃 🧠 🫀 🫁 🦷 🦴 👀 👁️ 👅 👄' },
  '🐾 สัตว์': { label: '🐾 สัตว์และธรรมชาติ', chars: '🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🙈 🙉 🙊 🐔 🐧 🐦 🦆 🦅 🦉 🦇 🐺 🐴 🦄 🐝 🦋 🐌 🐞 🐜 🦟 🦗 🕷️ 🦂 🐢 🐍 🦎 🦖 🦕 🐙 🦑 🦐 🦞 🦀 🐠 🐟 🐬 🐳 🦈 🐊 🐅 🐆 🦓 🦍 🐘 🦒 🦘 🦬 🐎 🐖 🐑 🦙 🐐 🦌 🐕 🐈 🦃 🦚 🦜 🦢 🦩 🕊️ 🐇 🦝 🦦 🦥 🐿️ 🦔 🌵 🎄 🌲 🌳 🌴 🌱 🌿 ☘️ 🍀 🪴 🍃 🍂 🍁 🍄 💐 🌷 🪷 🌹 🌺 🌸 🌼 🌻 🌞 🌝 🌛 🌜 🌚 🌕 🌙 🌎 🪐 ⭐ 🌟 ✨ ⚡ ☄️ 💥 🔥 🌪️ 🌈 ☀️ 🌤️ ⛅ ☁️ 🌦️ 🌧️ ⛈️ 🌨️ ❄️ ☃️ 🌬️ 💨 💧 💦 ☔ 🌊' },
  '🍓 อาหาร': { label: '🍓 อาหารและเครื่องดื่ม', chars: '🍇 🍉 🍊 🍋 🍌 🍍 🥭 🍎 🍐 🍑 🍒 🍓 🫐 🥝 🍅 🫒 🥥 🥑 🍆 🥔 🥕 🌽 🌶️ 🫑 🥒 🥬 🥦 🧄 🧅 🍄 🥜 🫘 🌰 🍞 🥐 🥖 🥨 🥯 🥞 🧇 🧀 🍖 🍗 🥩 🥓 🍔 🍟 🍕 🌭 🥪 🌮 🌯 🥙 🧆 🥚 🍳 🥘 🍲 🫕 🥣 🥗 🍿 🧂 🍱 🍘 🍙 🍚 🍛 🍜 🍝 🍠 🍢 🍣 🍤 🍡 🥟 🍦 🍧 🍨 🍩 🍪 🎂 🍰 🧁 🥧 🍫 🍬 🍭 🍮 🍯 🍼 🥛 ☕ 🫖 🍵 🍶 🍾 🍷 🍸 🍹 🍺 🍻 🥂 🥃 🥤 🧋 🧃 🧉 🧊' },
  '🚗 เดินทาง': { label: '🚗 การเดินทางและสถานที่', chars: '🚗 🚕 🚙 🚌 🏎️ 🚓 🚑 🚒 🚐 🛻 🚚 🚛 🚜 🛵 🏍️ 🛺 🚲 🛴 🛹 🛼 🚏 🛣️ ⛽ 🛞 🚨 🚥 🚦 🛑 ⚓ 🛟 ⛵ 🛶 🚤 🚢 ✈️ 🛩️ 🛫 🛬 🪂 💺 🚁 🚟 🚠 🚡 🚀 🛸 🌍 🌎 🌏 🗺️ 🧭 🏔️ ⛰️ 🌋 🏕️ 🏖️ 🏜️ 🏝️ 🏞️ 🏟️ 🏛️ 🏗️ 🛖 🏘️ 🏠 🏡 🏢 🏥 🏦 🏨 🏫 🏬 🏭 🏯 🏰 💒 🗼 🗽 ⛪ 🕌 🛕 🕍 ⛩️ ⛲ ⛺ 🌁 🌃 🏙️ 🌄 🌅 🌆 🌇 🌉 🎠 🎡 🎢' },
  '⚽ กิจกรรม': { label: '⚽ กิจกรรมและกีฬา', chars: '⚽ ⚾ 🥎 🏀 🏐 🏈 🏉 🎾 🥏 🎳 🏏 🏑 🏒 🥍 🏓 🏸 🥊 🥋 🥅 ⛳ ⛸️ 🎣 🤿 🎽 🎿 🛷 🥌 🎯 🪀 🪁 🎱 🔮 🪄 🧿 🎮 🕹️ 🎰 🎲 🧩 🧸 🪅 🪩 🪆 ♟️ 🎖️ 🏆 🥇 🥈 🥉 🏅 🏵️ 🎗️ 🎫 🎟️ 🎭 🖼️ 🎨 🧵 🪡 🧶 🎼 🎤 🎧 🎷 🪗 🎸 🎹 🎺 🎻 🪕 🥁 🪘 🎬 🎥 📽️ 🎞️' },
  '💡 สิ่งของ': { label: '💡 สิ่งของ', chars: '⌚ 📱 💻 ⌨️ 🖥️ 🖨️ 🖱️ 🕹️ 💽 💾 💿 📀 📷 📸 📹 📞 ☎️ 📺 📻 🎙️ 🎚️ 🎛️ 🧭 ⏱️ ⏰ 🕰️ ⌛ ⏳ 📡 🔋 🪫 🔌 💡 🔦 🕯️ 🧯 💵 💴 💶 💷 🪙 💰 💳 💎 ⚖️ 🪜 🧰 🪛 🔧 🔨 🛠️ ⛏️ 🪚 🔩 ⚙️ 🧲 🔫 💣 🧨 🪓 🔪 🗡️ ⚔️ 🛡️ ⚰️ 🪦 ⚱️ 🏺 📿 🧿 🔭 🔬 🩹 🩺 💊 🩻 🩼 🩸 🧬 🦠 🧪 🌡️ 🧹 🪠 🧺 🧻 🚽 🚰 🚿 🛁 🧼 🪥 🪒 🧽 🪣 🧴 🔑 🗝️ 🚪 🪑 🛋️ 🛏️ 🛍️ 🛒 🎁 🎀 🎊 🎉 🎈 🪄 🏮 🪭 🧧' },
  '❤️ หัวใจสี': { label: '❤️ หัวใจสี', chars: '❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 🩷 🩵 🩶 💔 ❤️‍🔥 ❤️‍🩹 💕 💞 💓 💗 💖 💘 💝 💟 💌 💋' },
  '🏳️ ธง': { label: '🏳️ ธง', chars: '🏁 🚩 🎌 🏴 🏳️ 🏳️‍🌈 🏳️‍⚧️ 🏴‍☠️ 🇺🇳 🇹🇭 🇺🇸 🇬🇧 🇯🇵 🇰🇷 🇨🇳 🇭🇰 🇹🇼 🇸🇬 🇲🇾 🇮🇩 🇵🇭 🇻🇳 🇮🇳 🇦🇺 🇳🇿 🇨🇦 🇲🇽 🇧🇷 🇦🇷 🇫🇷 🇩🇪 🇮🇹 🇪🇸 🇵🇹 🇳🇱 🇧🇪 🇨🇭 🇦🇹 🇸🇪 🇳🇴 🇩🇰 🇫🇮 🇵🇱 🇺🇦 🇷🇺 🇹🇷 🇸🇦 🇦🇪 🇮🇱 🇿🇦 🇪🇬' },
  '♡ หัวใจดาว': { label: '♡ หัวใจ ดาว และดอกไม้', chars: '♥ ♡ ❤ ❥ ❣ ❦ ❧ ღ დ ۵ ლ ❀ ✿ ❁ ❃ ❋ ✾ ✽ ✼ ❊ ❉ ❈ ❇ ❅ ❆ ✺ ✹ ✸ ✷ ✶ ✵ ✴ ✳ ✲ ✱ ✧ ✦ ★ ☆ ✩ ✪ ✫ ✬ ✭ ✮ ✯ ✰ ⭑ ⭒ ⋆ ⊹' },
  '➜ ลูกศร': { label: '➜ ลูกศร', chars: '← ↑ → ↓ ↔ ↕ ↖ ↗ ↘ ↙ ↚ ↛ ↜ ↝ ↞ ↠ ↢ ↣ ↤ ↥ ↦ ↧ ↩ ↪ ↫ ↬ ↭ ↯ ↰ ↱ ↲ ↳ ↴ ↶ ↷ ↺ ↻ ⇄ ⇅ ⇆ ⇇ ⇈ ⇉ ⇊ ⇋ ⇌ ⇐ ⇑ ⇒ ⇓ ⇔ ⇕ ⇖ ⇗ ⇘ ⇙ ⇚ ⇛ ⇜ ⇝ ⇠ ⇡ ⇢ ⇣ ⇤ ⇥ ➔ ➙ ➛ ➜ ➝ ➞ ➟ ➠ ➡ ➢ ➣ ➤ ➥ ➦ ➧ ➨ ➩ ➪ ➫ ➬ ➭ ➮ ➯ ➱ ➲ ➳ ➵ ➶ ➷ ➸ ➹ ➺ ➻ ➼ ➽ ➾ ⤴ ⤵ ⟵ ⟶ ⟷ ⟸ ⟹ ⟺ ⬅ ⬆ ⬇ ⬈ ⬉ ⬊ ⬋ ⬌ ⬍' },
  '✓ เครื่องหมาย': { label: '✓ เช็กและเครื่องหมาย', chars: '✓ ✔ ✕ ✖ ✗ ✘ ☓ ∨ √ ☐ ☑ ☒ ⊗ ⊙ ⊕ ⊖ ⊘ ⊚ ⊛ ⊜ ⊝ ⊞ ⊟ ⊠ ⊡ ⚠ ☢ ☣ ☮ ☯ ☪ ☸ ✝ ✞ ✟ † ‡ ♀ ♂ ⚧ ⚕ ⚖ ♻ ⚜ 🔱' },
  '♈ จักรราศี': { label: '♈ ดวงดาวและจักรราศี', chars: '♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓ ☉ ☽ ☾ ☿ ♀ ♂ ♃ ♄ ♅ ♆ ♇ ⚳ ⚴ ⚵ ⚶ ⚷ ⚸ ⚹ ⚺ ⚻ ⚼' },
  '♫ ดนตรี': { label: '♫ ดนตรี', chars: '♩ ♪ ♫ ♬ ♭ ♮ ♯ ° ø ؂ ≠ ≭ 🎼 🎵 🎶 🎙️ 🎤 🎧 🎸 🎹 🎺 🎻 🥁' },
  '∑ คณิตศาสตร์': { label: '∑ คณิตศาสตร์', chars: '∞ ∑ ∏ √ ∛ ∜ ∫ ∬ ∮ ∴ ∵ ∷ ≈ ≠ ≡ ≤ ≥ ≪ ≫ ± ∓ × ÷ · ∙ ⋅ ∘ ∝ ∧ ∨ ⊕ ⊗ ⊙ ∩ ∪ ∈ ∉ ∋ ∌ ⊂ ⊃ ⊆ ⊇ ∅ ∀ ∃ ∄ ∂ ∇ ℵ ℘ ℑ ℜ' },
  '「 วงเล็บ': { label: '「 วงเล็บและกรอบ', chars: '「 」 『 』 【 】 〔 〕 〈 〉 《 》 ‹ › « » ⌈ ⌉ ⌊ ⌋ ⟦ ⟧ ⟨ ⟩ ⟪ ⟫ ⟬ ⟭ ⦃ ⦄ ⦅ ⦆ ❨ ❩ ❪ ❫ ❬ ❭ ❮ ❯ ❰ ❱ ❲ ❳ ❴ ❵ ┌ ┐ └ ┘ ┏ ┓ ┗ ┛ ╔ ╗ ╚ ╝ ╭ ╮ ╰ ╯' },
  '… วรรคตอน': { label: '… วรรคตอนและตกแต่ง', chars: '· • ‣ ⁃ ∙ ⋅ ∘ ○ ● ◎ ◉ ◌ ◍ ◦ ⁌ ⁍ ❛ ❜ ❝ ❞ ‘ ’ “ ” ‚ „ ‟ ‐ ‑ ‒ – — ― … ⋯ ⋮ ⋱ ⁖ ⁘ ⁙ ⁚ ⁛ ⁜ ⁝ ⁞ ※ ⁂ ⁑ ⁕ ⁎ ‽ ¡ ¿ ‼ ⁇ ⁈ ⁉' },
  '♔ ไพ่และหมากรุก': { label: '♔ ไพ่และหมากรุก', chars: '♔ ♕ ♖ ♗ ♘ ♙ ♚ ♛ ♜ ♝ ♞ ♟ ♠ ♡ ♢ ♣ ♤ ♥ ♦ ♧' },
  '☀ อากาศและหน่วย': { label: '☀ อากาศและหน่วย', chars: '° ℃ ℉ ☀ ☁ ☂ ☃ ☉ ☼ ☽ ☾ ♨ ❄ ❅ ❆ ☇ ☈ ☄ ㎎ ㎏ ㎜ ㎝ ㎞ ㎡ ㏄ ㏎ ㏑ ㏒ ㏕' },
  '🔷 รูปทรง': { label: '🔷 รูปทรงและสี', chars: '🔴 🟠 🟡 🟢 🔵 🟣 🟤 ⚫ ⚪ 🟥 🟧 🟨 🟩 🟦 🟪 🟫 ⬛ ⬜ ◼️ ◻️ ▪️ ▫️ 🔶 🔷 🔸 🔹 🔺 🔻 💠 🔘 🔳 🔲 ⬟ ⬢ ⬣ △ ▽ ◁ ▷ ◇ ◆ ◈ ○ ◌ ◍ ◎ ◉ ● ◐ ◑ ◒ ◓ ◔ ◕ ◖ ◗' },
  '🌐 รายการ Dremendo': { label: '🌐 HTML Emoji Codes จาก Dremendo', chars: '⌚ ⌛ ⏰ ☔ ☕ ♿ ⚓ ⚡ ⛱ ⛳ ⛵ ⛽ ✂ ✅ ✈ ✉ ✋ ✔ ✖ ✨ ✳ ✴ ❄ ❇ ❌ ❎ ❓ ❔ ❕ ❗ ❤ ➕ ➖ ➗ 🆗 🌙 🌛 🌜 🌝 🌞 🌟 🌡 🌤 🌥 🌦 🌧 🌨 🌩 🌪 🌲 🌳 🌴 🌵 🌶 🌷 🌸 🌹 🌺 🌻 🌼 🌽 🌾 🌿 🍀 🍁 🍂 🍃 🍄 🍅 🍆 🍇 🍈 🍉 🍊 🍋 🍌 🍍 🍎 🍏 🍐 🍑 🍒 🍓 🍴 🍵 🍷 🍸 🍽 🎁 🎂 🎃 🎄 🎗 🎧 🎨 🎵 🎶 🎷 🎸 🎺 🎻 🎼 🎽 🎾 🏁 🏂 🏃 🏄 🏅 🏆 🏇 🏉 🏊 🏋 🏌 🏍 🏎 🏏 🏐 🏑 🏒 🏓 🏠 🏴 🐁 🐂 🐃 🐄 🐆 🐇 🐈 🐉 🐊 🐋 🐌 🐍 🐎 🐏 🐐 🐒 🐓 🐔 🐕 🐖 🐗 🐘 🐙 🐚 🐛 🐜 🐝 🐞 🐟 🐢 🐤 🐦 🐪 🐫 🐬 🐭 🐮 🐯 🐰 🐱 🐲 🐳 🐴 🐵 🐶 🐷 🐸 🐹 🐺 🐻 🐼 🐽 👀 👂 👆 👇 👈 👉 👊 👋 👌 👍 👎 👏 👐 👑 👒 👓 👔 👕 👖 👗 👘 👙 👚 👛 👜 👝 👞 👟 👠 👡 👢 👣 👤 👥 👦 👧 👨 👩 👪 👫 👬 👭 👮 👰 👱 👲 👳 👴 👵 👶 👷 👸 👹 👻 👽 👾 👿 💀 💉 💊 💌 💎 💑 💓 💔 💕 💖 💗 💘 💙 💚 💛 💜 💝 💞 💟 💤 💥 💩 💪 💬 💭 💮 💯 💰 💲 💳 💼 💽 💾 📂 📄 📅 📈 📉 📊 📋 📌 📍 📎 📏 📐 📜 📝 📞 📡 📢 📣 📵 📶 📷 📹 📺 📻 🔅 🔆 🔇 🔈 🔉 🔊 🔋 🔌 🔍 🔎 🔐 🔑 🔒 🔓 🔔 🔕 🔗 🔘 🔞 🔥 🔦 🔧 🔨 🔪 🔫 🔬 🔭 🔯 🔺 🔻 🔼 🔽 🕶 🕷 🕸 🖊 🖤 🖱 🗣 🗨 🗯 🗳 🗼 🗽 😀 😁 😂 😃 😄 😅 😆 😇 😈 😉 😊 😋 😌 😍 😎 😏 😐 😑 😒 😓 😔 😕 😖 😗 😘 😙 😚 😛 😜 😝 😞 😟 😠 😡 😢 😣 😤 😥 😦 😧 😨 😩 😪 😫 😬 😭 😮 😯 😰 😱 😲 😳 😴 😵 😶 😷 😸 😹 😺 😻 😼 😽 😾 😿 🙀 🙁 🙂 🙃 🙄 🙅 🙆 🙇 🙈 🙉 🙊 🙋 🙌 🙍 🙎 🙏 🚀 🚁 🚂 🚃 🚄 🚅 🚆 🚇 🚈 🚉 🚊 🚋 🚌 🚍 🚎 🚐 🚑 🚒 🚓 🚔 🚕 🚖 🚗 🚘 🚙 🚚 🚛 🚩 🚪 🚫 🚬 🚭 🚮 🚯 🚰 🚱 🚲 🚳 🚴 🚵 🚶 🚷 🚸 🚹 🚺 🚽 🚿 🛁 🛌 🛒 🛠 🤐 🤑 🤒 🤓 🤔 🤕 🤖 🤗 🤘 🤙 🤚 🤟 🤠 🤡 🤢 🤣 🤤 🤥 🤦 🤧 🤨 🤩 🤪 🤫 🤬 🤭 🤮 🤯 🤰 🤱 🤲 🤴 🤵 🤶 🥇 🥈 🥉 🥎 🥕 🥣 🧐 🧑 🧒 🧓 🧔 🧕 🧖 🧘 🧙 🧚 🧛 🧝 🧞 🧟 🧡' },
};

const EMOJI_GROUPS = new Set([
  '😀 อารมณ์', '🧑 คน', '🐾 สัตว์', '🍓 อาหาร', '🚗 เดินทาง',
  '⚽ กิจกรรม', '💡 สิ่งของ', '🏳️ ธง', '❤️ หัวใจสี', '🌐 รายการ Dremendo',
]);

function toDecimalHtmlEntities(value: string) {
  return Array.from(value, character => `&#${character.codePointAt(0)};`).join('');
}

export function UnicodePicker({ onPick }: { onPick: (value: string) => void }) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [category, setCategory] = useState(Object.keys(GROUPS)[0]);
  const [query, setQuery] = useState('');
  const chars = GROUPS[category].chars.split(/\s+/).filter(Boolean);
  const filtered = query ? chars.filter(char => char.includes(query)) : chars;

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        top: Math.max(8, Math.min(rect.bottom + 6, window.innerHeight - 330)),
        left: Math.max(8, Math.min(rect.left, window.innerWidth - 348)),
      });
    }
    setOpen(true);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button ref={triggerRef} type="button" className="tool-btn" title="เลือกอิโมจิและสัญลักษณ์ Unicode" aria-expanded={open} onMouseDown={event => event.preventDefault()} onClick={toggle}>😀 สัญลักษณ์</button>
      {open && typeof document !== 'undefined' && createPortal(<div ref={panelRef} style={{ position: 'fixed', zIndex: 10000, top: position.top, left: position.left, width: 'min(340px, calc(100vw - 16px))', padding: 10, borderRadius: 10, border: '1px solid #c4b5fd', background: '#fff', boxShadow: '0 12px 32px rgba(30, 20, 50, 0.22)' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <select className="glass-input" value={category} onChange={event => setCategory(event.target.value)} style={{ flex: 1, minWidth: 0, height: 32, padding: '2px 6px', fontSize: '0.78rem' }}>
            {Object.entries(GROUPS).map(([key, group]) => <option key={key} value={key}>{group.label}</option>)}
          </select>
          <button type="button" className="tool-btn" onClick={() => { setOpen(false); setQuery(''); }} aria-label="ปิดตัวเลือก">✕</button>
        </div>
        <input type="search" className="glass-input" value={query} onChange={event => setQuery(event.target.value)} placeholder="ค้นหาอักขระในหมวดนี้" style={{ width: '100%', height: 32, padding: '4px 7px', marginBottom: 8, fontSize: '0.78rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(0, 1fr))', gap: 3, maxHeight: 210, overflowY: 'auto' }}>
          {filtered.map((char, index) => {
            const isEmoji = EMOJI_GROUPS.has(category);
            const insertValue = isEmoji ? toDecimalHtmlEntities(char) : char;
            return <button key={`${char}_${index}`} type="button" className="tool-btn" title={isEmoji ? `${char} · ${insertValue}` : `แทรก ${char}`} aria-label={isEmoji ? `แทรก ${char} เป็น HTML numeric entity ${insertValue}` : `แทรก ${char}`} onMouseDown={event => event.preventDefault()} onClick={() => onPick(insertValue)} style={{ minWidth: 0, width: '100%', height: 34, padding: 2, fontSize: '1.15rem' }}>{char}</button>;
          })}
        </div>
        {filtered.length === 0 && <div style={{ padding: 8, color: '#71717a', fontSize: '0.78rem' }}>ไม่พบอักขระในหมวดนี้</div>}
        <div style={{ marginTop: 7, color: '#71717a', fontSize: '0.68rem' }}>อิโมจิแทรกเป็น HTML decimal entity (เช่น &amp;#128512;); สัญลักษณ์แทรกเป็นอักขระโดยตรง</div>
      </div>, document.body)}
    </div>
  );
}
