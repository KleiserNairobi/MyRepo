import { combineReducers } from 'redux';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import personReducer from './slices/personSlice';
import addressReducer from './slices/addressSlice';
//import permissionsReducer from './slices/permissoesSlice';
import photosReducer from './slices/photosSlice';
import bankDataReducer from './slices/bankDataSlice';
import vehicleReducer from './slices/vehicleSlice';
import deliveryReducer from './slices/deliverySlice';
import deliveryAddressReducer from './slices/deliveryAddressSlice';
import deliverymanReducer from './slices/deliverymanSlice';
//import schedulingReducer from './slices/schedulingSlice';
import configReducer from './slices/configSlice';
import notificationsReducer from './slices/notificationsSlice';

const reducers = combineReducers({
    usuario: userReducer,
    pessoa: personReducer,
    endereco: addressReducer,
//    permissoes: permissionsReducer,
    fotos: photosReducer,
    dadosBancarios: bankDataReducer,
    veiculo: vehicleReducer,
    entrega: deliveryReducer,
    entregaEndereco: deliveryAddressReducer,
    entregador: deliverymanReducer,
//    agendamento: schedulingReducer
    configuracoes: configReducer,
    notificacoes: notificationsReducer
});

export default function storeConfig() {
    return configureStore({ 
        reducer: reducers,
        middleware: getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false
        })
    });
}