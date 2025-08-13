import { Condition, ConditionBuilder } from "@cruncheevos/core";

import { constant } from "./value.js";

import { match } from "ts-pattern";

// ---------------------------------------------------------------------------------------------------

export function recall(): Condition.Value {
  return {
    type: 'Recall',
    size: '',
    value: 0,
  }
}

export function cond(
  flag:    Condition.Flag,
  lvalue:  Condition.Value | number,
  cmp?:    Condition.Operator,
  rvalue?: Condition.Value | number,
  hits?:   number
): Condition.Array {
  const lval = (typeof(lvalue) === 'number') ? constant(lvalue) : lvalue;
  
  const rtmp = (typeof(rvalue) === 'number') ? constant(rvalue) : rvalue;
  const rval: Partial<Condition.ValueArray> = [rtmp?.type, rtmp?.size, rtmp?.value];

  return [flag, lval.type, lval.size, lval.value, cmp, ...rval, hits];
}

// ---------------------------------------------------------------------------------------------------

interface ConditionObj {
  flag: Condition.Flag;
  lvalue: Condition.Value;
  cmp: Condition.OperatorComparison | Condition.OperatorModifier;
  rvalue: Condition.Value;
  hits: number;
}

function makeComparison(
  lvalue: Condition.Value | number,
  rvalue: Condition.Value | number,
  cmp: Condition.OperatorComparison
): ConditionObj {
  const lval: Condition.Value = typeof(lvalue) === 'number' ?
    { type: 'Value', size: '', value: lvalue } :
    lvalue;
  const rval: Condition.Value = typeof(rvalue) === 'number' ?
    { type: 'Value', size: '', value: rvalue } :
    rvalue;
  
  return {
    flag: '',
    lvalue: lval,
    cmp,
    rvalue: rval,
    hits: 0,
  };
}

function makeModifier(
  lvalue: Condition.Value | number,
  rvalue: Condition.Value | number,
  mod: Condition.OperatorModifier
): ConditionObj {
  const lval: Condition.Value = typeof(lvalue) === 'number' ?
    { type: 'Value', size: '', value: lvalue } :
    lvalue;
  const rval: Condition.Value = typeof(rvalue) === 'number' ?
    { type: 'Value', size: '', value: rvalue } :
    rvalue;
  
  return {
    flag: '',
    lvalue: lval,
    cmp: mod,
    rvalue: rval,
    hits: 0,
  };
}

type Value = Condition.Value | number;

export function prev({type, size, value}: Condition.Value): Condition.Value {
  return {type: 'Delta', size, value};
}

export function prior({type, size, value}: Condition.Value): Condition.Value {
  return {type: 'Prior', size, value};
}

export function eq(lvalue: Value, rvalue: Value): ConditionObj {
  return makeComparison(lvalue, rvalue, '=');
}

export function neq(lvalue: Value, rvalue: Value): ConditionObj {
  return makeComparison(lvalue, rvalue, '!=');
}

export function lt(lvalue: Value, rvalue: Value): ConditionObj {
  return makeComparison(lvalue, rvalue, '<');
}

export function lte(lvalue: Value, rvalue: Value): ConditionObj {
  return makeComparison(lvalue, rvalue, '<=');
}

export function gt(lvalue: Value, rvalue: Value): ConditionObj {
  return makeComparison(lvalue, rvalue, '>');
}

export function gte(lvalue: Value, rvalue: Value): ConditionObj {
  return makeComparison(lvalue, rvalue, '>=');
}

export function and(lvalue: Value, rvalue: Value): ConditionObj {
  return makeModifier(lvalue, rvalue, '&');
}

export function xor(lvalue: Value, rvalue: Value): ConditionObj {
  return makeModifier(lvalue, rvalue, '^');
}

export function add(lvalue: Value, rvalue: Value): ConditionObj {
  return makeModifier(lvalue, rvalue, '+');
}

export function sub(lvalue: Value, rvalue: Value): ConditionObj {
  return makeModifier(lvalue, rvalue, '-');
}

export function mul(lvalue: Value, rvalue: Value): ConditionObj {
  return makeModifier(lvalue, rvalue, '*');
}

export function div(lvalue: Value, rvalue: Value): ConditionObj {
  return makeModifier(lvalue, rvalue, '/');
}

export function mod(lvalue: Value, rvalue: Value): ConditionObj {
  return makeModifier(lvalue, rvalue, '%');
}

// TODO: Update to work with longer condition chains
export function not(condition: ConditionBuilder): ConditionBuilder {
  if (condition.conditions.length !== 1) {
    throw new Error('Whoops, expected a single condition');
  }

  return match(condition.conditions[0].cmp)
    .with('=',  () => condition.withLast({ cmp: '!=' }))
    .with('!=', () => condition.withLast({ cmp: '='  }))
    .with('<',  () => condition.withLast({ cmp: '>=' }))
    .with('<=', () => condition.withLast({ cmp: '>'  }))
    .with('>',  () => condition.withLast({ cmp: '<=' }))
    .with('>=', () => condition.withLast({ cmp: '<'  }))
    .otherwise(() => condition);
}
