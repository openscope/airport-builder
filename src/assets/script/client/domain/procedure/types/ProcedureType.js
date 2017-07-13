import t from 'tcomb';

// Form/Update types
export const ProcedureRouteTypeEnum = t.enums.of([
    'SID',
    'STAR'
], 'ProcedureRouteTypeEnum');

export const BaseRouteWaypointType = t.struct({
    isHold: t.Boolean,
    isVector: t.Boolean
}, 'BaswRouteWaypointType');

export const BaseSegmentUpdateType = t.struct({
    type: ProcedureRouteTypeEnum,
    icao: t.String,
    name: t.String
}, 'BaseSegmentUpdateType');

export const MinMaxValueType = t.struct({
    minValue: t.Number,
    maxValue: t.Number
}, 'MinMaxValueType');

export const LessThenGreaterThanValueType = t.struct({
    value: t.Number
}, 'LessThenGreaterThanValueType');

export const RestrictionQualifierEnum = t.enums({
    GT: 'Greater Than',
    LT: 'Less Than',
    MIN_MAX: 'Min/Max'
}, 'RestrictionQualifierEnum');

export const BaseWaypointRestrictionType = t.struct({
    restrictionQualifier: t.maybe(RestrictionQualifierEnum)
}, 'BaseWaypointRestrictionType');

export const RouteWaypointRestrictionType = t.union([
    BaseWaypointRestrictionType,
    MinMaxValueType,
    LessThenGreaterThanValueType
], 'RouteWaypointRestrictionType');

RouteWaypointRestrictionType.dispatch = (value) => {
    if (!value || !value.restrictionQualifier) {
        return BaseWaypointRestrictionType;
    }

    if (value.restrictionQualifier === 'MIN_MAX') {
        return BaseWaypointRestrictionType.extend(MinMaxValueType);
    }

    return BaseWaypointRestrictionType.extend(LessThenGreaterThanValueType);
};


// PreviewTypes
export const RouteSegmentWaypointType = t.union([
    t.String,
    t.tuple([t.String, t.String])
], 'RouteSegmentWaypointType');

export const RouteSegmentWaypointListType = t.list(RouteSegmentWaypointType, 'RouteSegmentWaypointListType');

export const BaseProcedureRouteType = t.struct({
    icao: t.String,
    name: t.String,
    suffix: t.dict(t.String, t.String),
    body: RouteSegmentWaypointListType,
    rwy: t.dict(t.String, RouteSegmentWaypointListType),
    draw: t.list(t.list(t.String))
}, 'ProcedureRouteType');

export const SidProcedureRouteType = BaseProcedureRouteType.extend({
    exitPoints: t.dict(t.String, RouteSegmentWaypointListType)
}, 'StarProcedureRouteType');

export const SidProcedureRouteDict = t.dict(t.String, SidProcedureRouteType);

export const StarProcedureRouteType = BaseProcedureRouteType.extend({
    entryPoints: t.dict(t.String, RouteSegmentWaypointListType)
}, 'StarProcedureRouteType');

export const StarProcedureRouteDict = t.dict(t.String, StarProcedureRouteType);