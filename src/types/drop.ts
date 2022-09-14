import type { BaseContext } from './common';
import { DropEventType } from '@lib/constants';
import type { EventObject } from 'xstate/lib/types';
import type Peer from 'peerjs';
import type { DataConnection } from 'peerjs';

export type DropContext = BaseContext & {
    message: Record<string, any>;
    integrity: string | null;
    dropKey: CryptoKey | null;
};

export type DropEvent = EventObject & {
    type: DropEventType;
};

export type AnyDropEvent = DropEvent & {
    [key: string]: any;
};

export interface InitDropEvent extends DropEvent {
    type: DropEventType.Init;
    id: string;
    peer: Peer;
    keyPair: CryptoKeyPair;
    nonce: string;
}

export interface ConnectEvent extends DropEvent {
    type: DropEventType.Connect;
    connection: DataConnection;
}

export interface WrapEvent extends DropEvent {
    type: DropEventType.Wrap;
    payload: Record<string, any>;
    integrity: string;
}

export interface HandshakeEvent extends DropEvent {
    type: DropEventType.Handshake;
}

export interface HandshakeCompleteEvent extends DropEvent {
    type: DropEventType.HandshakeComplete;
    dropKey: CryptoKey;
}

export interface CompleteEvent extends DropEvent {
    type: DropEventType.Confirm;
}