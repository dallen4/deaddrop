import { GrabEventType, GrabState } from '../constants';
import { createMachine, TransitionsConfig } from 'xstate';
import type { AnyGrabEvent } from 'types/grab';
import type { GrabContext } from 'types/grab';
import { raise as baseRaise } from 'xstate/lib/actions';

export const initGrabContext = (): GrabContext => ({
    id: null,
    mode: 'raw',
    message: null,
    dropperId: null,
    peer: null,
    connection: null,
    keyPair: null,
    grabKey: null,
    nonce: null,
});

export const raise = baseRaise<{}, AnyGrabEvent>;

export const grabMachine = createMachine<{}, AnyGrabEvent>({
    id: 'grab',
    preserveActionOrder: true,
    predictableActionArguments: true,
    initial: GrabState.Initial,
    states: {
        [GrabState.Initial]: {
            on: {
                INITIALIZE: {
                    target: GrabState.Ready,
                    actions: [raise(GrabEventType.Connect)],
                },
            } as TransitionsConfig<{}, AnyGrabEvent>,
        },
        [GrabState.Ready]: {
            on: {
                CONNECT: {
                    target: GrabState.Connected,
                },
            },
        },
        [GrabState.Connected]: {
            on: {
                HANDSHAKE: {
                    target: GrabState.Waiting,
                },
            },
        },
        [GrabState.Waiting]: {
            on: {
                GRAB: {
                    target: GrabState.Received,
                    actions: [raise(GrabEventType.Verify)],
                },
            } as TransitionsConfig<{}, AnyGrabEvent>,
        },
        [GrabState.Received]: {
            on: {
                VERIFY: {
                    target: GrabState.Confirmed,
                },
            },
        },
        [GrabState.AwaitingConfirmation]: {
            on: {
                CONFIRM: {
                    target: GrabState.Confirmed,
                },
                FAILURE: {
                    target: GrabState.Error,
                },
            },
        },
        [GrabState.Confirmed]: {
            on: {
                CLEANUP: {
                    target: GrabState.Completed,
                },
            },
        },
        [GrabState.Error]: {},
        [GrabState.Completed]: {
            type: 'final',
        },
    },
});
