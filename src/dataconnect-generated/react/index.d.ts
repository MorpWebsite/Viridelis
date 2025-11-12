import { CreateNewUserData, CreateNewUserVariables, GetCurrentUserData, GetCurrentUserVariables, AddNewPlantData, AddNewPlantVariables, ListSpeciesData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateNewUser(options?: useDataConnectMutationOptions<CreateNewUserData, FirebaseError, CreateNewUserVariables>): UseDataConnectMutationResult<CreateNewUserData, CreateNewUserVariables>;
export function useCreateNewUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewUserData, FirebaseError, CreateNewUserVariables>): UseDataConnectMutationResult<CreateNewUserData, CreateNewUserVariables>;

export function useGetCurrentUser(vars: GetCurrentUserVariables, options?: useDataConnectQueryOptions<GetCurrentUserData>): UseDataConnectQueryResult<GetCurrentUserData, GetCurrentUserVariables>;
export function useGetCurrentUser(dc: DataConnect, vars: GetCurrentUserVariables, options?: useDataConnectQueryOptions<GetCurrentUserData>): UseDataConnectQueryResult<GetCurrentUserData, GetCurrentUserVariables>;

export function useAddNewPlant(options?: useDataConnectMutationOptions<AddNewPlantData, FirebaseError, AddNewPlantVariables>): UseDataConnectMutationResult<AddNewPlantData, AddNewPlantVariables>;
export function useAddNewPlant(dc: DataConnect, options?: useDataConnectMutationOptions<AddNewPlantData, FirebaseError, AddNewPlantVariables>): UseDataConnectMutationResult<AddNewPlantData, AddNewPlantVariables>;

export function useListSpecies(options?: useDataConnectQueryOptions<ListSpeciesData>): UseDataConnectQueryResult<ListSpeciesData, undefined>;
export function useListSpecies(dc: DataConnect, options?: useDataConnectQueryOptions<ListSpeciesData>): UseDataConnectQueryResult<ListSpeciesData, undefined>;
