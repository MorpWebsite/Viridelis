import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddNewPlantData {
  plant_insert: Plant_Key;
}

export interface AddNewPlantVariables {
  speciesId: UUIDString;
  name: string;
  acquisitionDate: DateString;
}

export interface CareLog_Key {
  id: UUIDString;
  __typename?: 'CareLog_Key';
}

export interface CreateNewUserData {
  user_insert: User_Key;
}

export interface CreateNewUserVariables {
  displayName: string;
  email?: string | null;
  photoUrl?: string | null;
}

export interface GetCurrentUserData {
  user?: {
    id: UUIDString;
    displayName: string;
    email?: string | null;
    photoUrl?: string | null;
    createdAt: TimestampString;
    plants_on_user: ({
      id: UUIDString;
      name: string;
      species: {
        commonName: string;
        scientificName: string;
      };
    } & Plant_Key)[];
  } & User_Key;
}

export interface GetCurrentUserVariables {
  id: UUIDString;
}

export interface ListSpeciesData {
  speciess: ({
    id: UUIDString;
    commonName: string;
    scientificName: string;
    description?: string | null;
    careInstructions: string;
    wateringFrequency: string;
    lightRequirements: string;
    humidityRequirements?: string | null;
    imageUrl?: string | null;
  } & Species_Key)[];
}

export interface Plant_Key {
  id: UUIDString;
  __typename?: 'Plant_Key';
}

export interface Reminder_Key {
  id: UUIDString;
  __typename?: 'Reminder_Key';
}

export interface Species_Key {
  id: UUIDString;
  __typename?: 'Species_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateNewUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewUserVariables): MutationRef<CreateNewUserData, CreateNewUserVariables>;
  operationName: string;
}
export const createNewUserRef: CreateNewUserRef;

export function createNewUser(vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;
export function createNewUser(dc: DataConnect, vars: CreateNewUserVariables): MutationPromise<CreateNewUserData, CreateNewUserVariables>;

interface GetCurrentUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCurrentUserVariables): QueryRef<GetCurrentUserData, GetCurrentUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCurrentUserVariables): QueryRef<GetCurrentUserData, GetCurrentUserVariables>;
  operationName: string;
}
export const getCurrentUserRef: GetCurrentUserRef;

export function getCurrentUser(vars: GetCurrentUserVariables): QueryPromise<GetCurrentUserData, GetCurrentUserVariables>;
export function getCurrentUser(dc: DataConnect, vars: GetCurrentUserVariables): QueryPromise<GetCurrentUserData, GetCurrentUserVariables>;

interface AddNewPlantRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddNewPlantVariables): MutationRef<AddNewPlantData, AddNewPlantVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddNewPlantVariables): MutationRef<AddNewPlantData, AddNewPlantVariables>;
  operationName: string;
}
export const addNewPlantRef: AddNewPlantRef;

export function addNewPlant(vars: AddNewPlantVariables): MutationPromise<AddNewPlantData, AddNewPlantVariables>;
export function addNewPlant(dc: DataConnect, vars: AddNewPlantVariables): MutationPromise<AddNewPlantData, AddNewPlantVariables>;

interface ListSpeciesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListSpeciesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListSpeciesData, undefined>;
  operationName: string;
}
export const listSpeciesRef: ListSpeciesRef;

export function listSpecies(): QueryPromise<ListSpeciesData, undefined>;
export function listSpecies(dc: DataConnect): QueryPromise<ListSpeciesData, undefined>;

