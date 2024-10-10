/**
 * Main Controller
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Styles from '../assets/scss/styles';

// Pages List
import LoginPage from '../pages/login/login';
import RegisterPage from '../pages/register/register';
import RegisterPfPage from '../pages/register/registerPF';
import RegisterPjPage from '../pages/register/registerPJ';
import RegisterAddressPage from '../pages/register/registerAddress';
import RegisterMarketSegmentPage from '../pages/register/registerMarketSegment';
import RegisterPasswordPage from '../pages/register/registerPassword';
import RegisterDocumentsPage from '../pages/register/registerDocuments';
import RegisterTermsPage from '../pages/register/registerTerms';
import RegisterFinishedPage from '../pages/register/registerFinished';
import MenuPage from '../pages/menu/menu';
import SolicitationPage from '../pages/solicitation/solicitation';
import ChooseVehiclePage from '../pages/vehicle/chooseVehicle';
import InsertVehiclePage from '../pages/vehicle/insertVehicle';
import ListFavoriteVehiclePage from '../pages/vehicle/listFavoriteVehicle';
import AccountPage from '../pages/account/account';
import EditPerfilPage from '../pages/account/editPerfil';
import ConfigurationsPage from '../pages/configuration/configurations';
import SchedulesPage from '../pages/schedule/schedules';
import DeliveriesPage from '../pages/delivery/deliveries';
import DeliveryDetailsPage from '../pages/delivery/deliveryDetails';
import DeliveryInProgressPage from '../pages/delivery/deliveryInProgress';
import DeliveryFinalizedPage from '../pages/delivery/deliveryFinalized';
import FinancialTransactionsPage from '../pages/financial/financialTransactions';
import WithdrawalRequestPage from '../pages/financial/withdrawalRequest';
import ContactsPage from '../pages/contact/contacts';
import ChatSupportPage from '../pages/chat/chatSupport';

// Navigations
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Solicitation Pages Navigation
const solicitationPages = () => (
  <Stack.Navigator
    initialRouteName="Solicitation"
    screenOptions={{
      headerStyle: Styles.header,
      headerTitleStyle: Styles.headerTitle,
      headerTitleAlign: 'center'
    }}>
    <Stack.Screen
      name="Solicitation"
      component={SolicitationPage}
      options={{
        title: 'Painel Principal'
      }} />
    <Stack.Screen
      name="ChooseVehicle"
      component={ChooseVehiclePage}
      options={{
        title: 'Veículo'
      }} />
    <Stack.Screen
      name="InsertVehicle"
      component={InsertVehiclePage}
      options={{
        title: 'Inserir Veículo'
      }} />
    <Stack.Screen
      name="ListFavoriteVehicle"
      component={ListFavoriteVehiclePage}
      options={{
        title: 'Veículos'
      }} />
    <Stack.Screen
      name="Configurations"
      component={ConfigurationsPage}
      options={{
        title: 'Configuraçōes'
      }} />
    <Stack.Screen
      name="Schedules"
      component={SchedulesPage}
      options={{
        title: 'Agendamentos'
      }} />
    <Stack.Screen
      name="Deliveries"
      component={DeliveriesPage}
      options={{
        title: 'Entregas'
      }} />
    <Stack.Screen
      name="DeliveryDetails"
      component={DeliveryDetailsPage}
      options={{
        title: 'Detalhes'
      }} />
    <Stack.Screen
      name="DeliveryInProgress"
      component={DeliveryInProgressPage}
      options={{
        title: 'Entrega em Andamento'
      }} />
    <Stack.Screen
      name="DeliveryFinalized"
      component={DeliveryFinalizedPage}
      options={{
        title: 'Entrega Concluída'
      }} />
    <Stack.Screen
      name="FinancialTransactions"
      component={FinancialTransactionsPage}
      options={{
        title: 'Movimentações Financeiras'
      }} />
    <Stack.Screen
      name="WithdrawalRequest"
      component={WithdrawalRequestPage}
      options={{
        title: 'Solicitação de Saque'
      }} />
    <Stack.Screen
      name="EditPerfil"
      component={EditPerfilPage}
      options={{
        title: 'Perfil'
      }} />
    <Stack.Screen
      name="Contacts"
      component={ContactsPage}
      options={{
        title: 'Fale conosco'
      }} />
    <Stack.Screen
      name="ChatSupport"
      component={ChatSupportPage}
      options={{
        title: 'Suporte'
      }} />
  </Stack.Navigator>
);

// Tabs Navigation
const tabsPages = () => (
  <Tab.Navigator
    initialRouteName="SolicitationPages"
    tabBarOptions={{
      activeTintColor: '#FFCC00',
      inactiveTintColor: '#FFFFFF',
      tabStyle: Styles.tabBarBottom,
      style: { height: 74 },
      labelStyle: Styles.tabBarBottomText,
      keyboardHidesTabBar: true
    }}
  >
    <Tab.Screen
      name="Menu"
      component={MenuPage}
      options={{
        tabBarLabel: 'Menu',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="menu"
            color={color}
            size={32} />
        )
      }}
    />
    <Tab.Screen
      name="SolicitationPages"
      component={solicitationPages}
      options={{
        tabBarLabel: 'Painel',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="view-dashboard"
            color={color}
            size={32} />
        )
      }}
    />
    <Tab.Screen
      name="Account"
      component={AccountPage}
      options={{
        tabBarLabel: 'Conta',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="tooltip-account"
            color={color}
            size={32} />
        )
      }}
    />
  </Tab.Navigator>
);

// Main Navigation
const mainNavigation = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="default" backgroundColor={Styles.body.backgroundColor} />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen
          name="Login"
          component={LoginPage} />
        <Stack.Screen
          name="Register"
          component={RegisterPage} />
        <Stack.Screen
          name="RegisterPF"
          component={RegisterPfPage} />
        <Stack.Screen
          name="RegisterPJ"
          component={RegisterPjPage} />
        <Stack.Screen
          name="RegisterAddress"
          component={RegisterAddressPage} />
        <Stack.Screen
          name="RegisterMarketSegment"
          component={RegisterMarketSegmentPage} />
        <Stack.Screen
          name="RegisterPassword"
          component={RegisterPasswordPage} />
        <Stack.Screen
          name="RegisterDocuments"
          component={RegisterDocumentsPage} />
        <Stack.Screen
          name="RegisterTerms"
          component={RegisterTermsPage} />
        <Stack.Screen
          name="RegisterFinished"
          component={RegisterFinishedPage} />
        <Stack.Screen
          name="InternalApp"
          component={tabsPages} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default mainNavigation;