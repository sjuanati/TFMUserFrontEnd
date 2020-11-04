# Treball Final de Màster - Universitat Politècnica de Catalunya

La aplicación propuesta hace uso de las redes descentralizadas para realizar una trazabilidad de los medicamentos desde el momento en que abandonan la farmacia hasta que llegan al consumidor final, almacenando los datos de cada paso en transacciones que se registran en la Blockchain. Esto permite que la disponibilidad y la persistencia de la información sean la base para un sistema seguro, que garantiza que los datos recogidos en cada paso sean íntegros a través del uso de criptografía.

## 1) Intalación

Esta aplicación require [Node.js](https://nodejs.org/) para poder ser ejecutada.

Para instalar la aplicación, clonar este repositorio y ejecutar:

```sh
$ npm install
```

## 2) Ejecución

Para ejecutar la aplicación en modo local, es necesario disponer de Xcode o Android Studio previamente instalado.

**Opción 1:**
* Paso 1: Ejecutar

```sh
$ npm start
```

* Paso 2: Abrir Xcode para la versión iOS, o Android Studio para la versión Android, y hacer 'run'

**Opción 2:**

```sh
$ react-native run-ios
```
o 
```sh
$ react-native run-android
```

## 3) Entorno

La aplicación puede apuntar a un servidor local (localhost) o a un servidor en cloud (Amazon Web Services). Dicha configuración se puede modificar en el siguiente fichero:

`TFMUserFrontEnd/urlServer.js`

Para local, usar la dirección IP de la máquina local
Para cloud, usar la dirección IP de AWS


## 4) Troubleshooting

Durante el desarrollo de la aplicación hemos encontrado un elevado número de problemas relacionados esencialmente con bugs, breaking changes, discrepancia de versiones, etc, en general vinculados con los frameworks de desarrollo de aplicaciones móviles, así como problemas con algunas librerías al actualizarlas. A continuación mostramos una guía de resolución de problemas por si el mismo error se produce en futuros proyectos:

**(NodeJS) Error: listen EADDRINUSE: address already in use :::3001**

```sh
$ ps aux | grep node
$ kill -9 PID
```
or
```sh
$ killall node
```

**(react-native run-android): Error: spawnSync ./gradlew EACCES**
```sh
$ chmod 755 android/gradlew
```
**(react-native run-android); Task :app:transformDexArchiveWithDexMergerForDebug FAILED**

-> just add this in android/app/build.gradle
```sh
android{
defaultConfig{
  .......
 multiDexEnabled true 
  }
}
```
**(react-native run-android): Error: Command failed: ./gradlew app:installDebug**

* Go to \android\gradle\wrapper\gradle-wrapper.properties" this file edit as ...(upgrade gradle version) :
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-6.3-all.zip

* run `./gradlew in cmd path \android\`

**(Xcode) Error: Multiple commands produce..**

-> Project->Targets->(Project)->Build Phases->Copy Bundle Resources->(remove everything)

**(iOS) App crashed when showing map**

(Project)-> AppDelegate.m
-> #import <GoogleMaps/GoogleMaps.h>

**(Xcode) clang: error: linker command failed with exit code 1 (file referring to test folder)**

-> Remove Project->Info->Targets->(file ending with Tests)

**(Android Studio): Cannot find module 'react-native/cli'**

* Android Studio -> Preferences -> Build,Execution,Deployment -> Gradle : if you see the following message:
'gradle-wrapper.properties' not found
* $ gradle wrapper  (not in the project directory, but from any global path)
* Add this path to the Android Studio gradle path of step 1)

**(Android device running from Android Studio): Could not connect to development server**
The below command needs to be executed before:
```sh
$ react-native run-android 
```
**(react-native run-android) error Failed to install the app. Make sure you have the Android development environment set up**

-> Open Android Studio and load the android folder once

**(iOS) Unrecognized font family 'Ionicons'**

* Add in the podfile:
    `pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'` And then: pod update

* Add in info.plist
  <key>UIAppFonts</key>
  <array>
    <string>AntDesign.ttf</string>
    <string>Entypo.ttf</string>
    <string>EvilIcons.ttf</string>
    <string>Feather.ttf</string>
    <string>FontAwesome.ttf</string>
    <string>FontAwesome5_Brands.ttf</string>
    <string>FontAwesome5_Regular.ttf</string>
    <string>FontAwesome5_Solid.ttf</string>
    <string>Foundation.ttf</string>
    <string>Ionicons.ttf</string>
    <string>MaterialIcons.ttf</string>
    <string>MaterialCommunityIcons.ttf</string>
    <string>SimpleLineIcons.ttf</string>
    <string>Octicons.ttf</string>
    <string>Zocial.ttf</string>
  </array>

**Iconicons not being shown**

Android: add this line at android/app/build.gradle
`apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"`

**(iOS) TypeError: null is not an object (evaluating 'RNFSManager.RNFSFileTypeRegular')**
or
**iOS: Error: @react-native-community/geolocation:**

Actually it was happening in drMax pharmacy where it is not used
stop current console! if error persists,
```sh
npm start --reset-cache
```
**iOS Icon: ITMS-90713: Missing Info.plist value - A value for the Info.plist key 'CFBundleIconName' is missing in the bundle 'com.doctormax.pharma'.**  

In AppIcon, Target Membership -> make sure it 'DoctorMaxPharmaFrontEnd' is marked

**iOS: Warning: Module AudioRecorderManager requires main queue setup**

https://www.youtube.com/watch?v=tDVFfMZDoDc

**Images not showing in iOS14**

https://github.com/facebook/react-native/issues/29279#issuecomment-658244428