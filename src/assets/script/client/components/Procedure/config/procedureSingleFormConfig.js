import {
    listLayout,
    hlistLayout,
    routeSegmentLayout,
    routeSegmentWaypointLayout
} from '../../../lib/Form/template';

const drawConfig = {
    template: listLayout,
    disableOrder: true,
    item: {
        fields: {
            drawSegment: {
                template: hlistLayout,
                disableOrder: true,
                config: {
                    hideLegend: true
                },
                item: {
                    disableOrder: true
                }
            }
        }
    }
};

const routeSegmentConfig = {
    template: listLayout,
    config: {
        striped: false,
        divided: true,
        depth: 1
    },
    disableOrder: true,
    item: {
        template: routeSegmentLayout,
        fields: {
            waypoints: {
                template: listLayout,
                config: {
                    striped: false,
                    divided: true,
                    hideLegend: true,
                    hlistSpacious: true,
                    depth: 2
                },
                disableOrder: true,
                item: {
                    template: routeSegmentWaypointLayout,
                    fields: {
                        altitude: {
                            // label: 'Altitude Restriction',
                            fields: {
                                restrictionQualifier: {
                                    legend: false
                                }
                            }
                        },
                        speed: {
                            // label: 'Speed Restriction',
                            fields: {
                                restrictionQualifier: {
                                    legend: false
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export const FORM_CONFIG = {
    i18n: {
        add: 'Add',         // add button
        down: 'Down',       // move down button
        optional: '',       // suffix added to optional fields
        required: '',       // suffix added to required fields
        remove: 'Remove',   // remove button
        up: 'Up'            // move up button
    },
    fields: {
        draw: drawConfig,
        body: {
            template: listLayout,
            disableOrder: true,
            item: {
                template: routeSegmentWaypointLayout,
                fields: {
                    altitude: {
                        label: 'Altitude Restriction',
                        fields: {
                            restrictionQualifier: {
                                legend: false
                            }
                        }
                    },
                    speed: {
                        label: 'Speed Restriction',
                        fields: {
                            restrictionQualifier: {
                                legend: false
                            }
                        }
                    }
                }
            }
        },
        rwy: routeSegmentConfig,
        entryPoints: routeSegmentConfig,
        exitPoints: routeSegmentConfig
    }
};
