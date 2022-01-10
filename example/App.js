
import React, { Component, useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MMStorage from 'react-native-mmstorage';

export default function App() {

	useEffect(() => {
		MMStorage.initMMStorage([]);
	}, [])

	useEffect(() => {
		let user = {
			id: Math.floor(Math.random() * 1000000),
			name: 'lily',
			age: 23,
			sex: 1
		}
		MMStorage.setStringifyValue("user", user);
		MMStorage.getParsedValue("user").then((value) => {
			console.log("user: ", value);
		})
		MMStorage.hasKey('user').then(rs => {
			console.log('before delete ', rs);
		})
		MMStorage.delAllValue();
		MMStorage.hasKey('user').then(rs => {
			console.log('after delete ', rs);
		})
	}, [])

	return (
		<View></View>
	);
}