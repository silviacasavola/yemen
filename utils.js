export function createElement(type, className, innerHTML) {
  const element = document.createElement(type);
  if (className) element.className = className;
  if (innerHTML) element.innerHTML = innerHTML;
  return element;
}

export function getIdsFromShots(shots) {
  return shots.map((shot) => "FB_P_YEM_86002_0" + shot[0] + "_" + shot[1]);
}

export function getMetadataFromId(metadata, id) {
  return metadata.find((entry) => entry.Name === id + ".jpg");
}

export function parseShotIndex(shotInfo) {
  const entries = shotInfo.split(/\s+/);
  const result = [];

  entries.forEach((entry) => {
    const [folderPart, shotsPart] = entry.split(/\(([^)]+)\)/);
    const folder = folderPart.trim();
    const shotsRanges = shotsPart.split(";");

    shotsRanges.forEach((range) => {
      const [startStr, endStr] = range.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (isNaN(end)) {
        // Single shot number, no range
        result.push([folder, startStr.padStart(3, "0")]);
      } else {
        // Range of shots
        for (let shot = start; shot <= end; shot++) {
          result.push([folder, shot.toString().padStart(3, "0")]);
        }
      }
    });
  });

  return result;
}
