let D = line => {
  // D -> 1D | 2D | 3D |1 | 2 | 3
  let match = line.match(/^[123]+/);
  if (!match) {
    throw new Error("Failed at D.");
  }
  return line.replace(/^[123]+/, "");
};
let V = line => {
  //V -> aD | bD | cD | tD
  let match = line.match(/^[abct]/);
  if (!match) {
    throw new Error("Failed at V.");
  }
  line = line.replace(/^[abct]/, "");
  return D(line);
};
let C = line => {
  // C -> V>=V | V=<V
  line = V(line);
  let match = line.match(/^(>=|=<)/);
  if (!match) {
    throw new Error("Failed at C.");
  }
  line = line.replace(/^(>=|=<)/, "");
  return V(line);
};
let S = line => {
  // S -> if C then P else P;
  let match1 = line.match(/^if /);
  if (!match1) {
    throw new Error("Failed at S.");
  }
  line = line.replace(/^if /, "");
  line = C(line);
  let match2 = line.match(/^ then /);
  if (!match2) {
    throw new Error("Failed at S.");
  }
  line = line.replace(/^ then /, "");
  line = P(line);
  let match3 = line.match(/^ else /);
  if (!match3) {
    throw new Error("Failed at S.");
  }
  line = line.replace(/^ else /, "");
  return P(line);
};
let P = line => {
  // P -> V:=V | V:=D | S
  let v1 = line;
  try {
    v1 = V(v1);
    let match = v1.match(/^:=/);
    if (!match) {
      throw new Error("Failed at P.");
    }
    v1 = v1.replace(/^:=/, "");
    return V(v1);
  } catch (e) {}

  let v2 = line;
  try {
    v2 = V(v2);
    let match = v2.match(/^:=/);
    if (!match) {
      throw new Error("Failed at P.");
    }
    v2 = v2.replace(/^:=/, "");
    return D(v2);
  } catch (e) {}

  let v3 = line;
  try {
    return S(v3);
  } catch (e) {}

  throw new Error("Failed at P.");
};

let get_token = line => {
  const t = {
    key_word: /^(if|then|else)/g,
    identifier: /^([abct][123])+/g,
    number: /^([123])+/g,
    operation: /^(:=|>=|=<)/g,
    symbol: /^\s/g,
    rest: /^./g
  };
  let result = [];

  while (line) {
    (() => {
      for (let i in t) {
        let c = line.match(t[i]);
        if (c) {
          result.push({ value: c[0], type: i });
          line = line.replace(t[i], "");
          return;
        }
      }
    })();
  }

  result.toString = function() {
    let s = "";
    for (let i of this) {
      s += `< ${i.type}, ${i.value}> `;
    }
    return s;
  };

  return result;
};
module.exports = { run: S, get_token };
