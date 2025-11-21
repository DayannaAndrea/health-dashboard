# Dashboard de Salud y Bienestar - Documentación del Proyecto

## Índice
1. [Descripción General](#descripción-general)
2. [Objetivos del Proyecto](#objetivos-del-proyecto)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Funcionalidades Implementadas](#funcionalidades-implementadas)
6. [Sistema de Autenticación](#sistema-de-autenticación)
7. [Almacenamiento de Datos](#almacenamiento-de-datos)
8. [Diseño Responsive](#diseño-responsive)
9. [Panel de Administrador](#panel-de-administrador)
10. [Manual de Usuario](#manual-de-usuario)
11. [Consideraciones Técnicas](#consideraciones-técnicas)
12. [Posibles Mejoras Futuras](#posibles-mejoras-futuras)

---

## Descripción General

El **Dashboard de Salud y Bienestar** es una aplicación web desarrollada para ayudar a los usuarios a monitorear y registrar sus hábitos diarios de salud. La aplicación permite hacer seguimiento de consumo de agua, horas de sueño, ejercicio físico y alimentación, proporcionando una interfaz intuitiva y moderna para la gestión personal de datos de salud.

### Características Principales
- Sistema de autenticación multi-usuario
- Seguimiento de múltiples métricas de salud
- Interfaz responsive para todos los dispositivos
- Almacenamiento local persistente
- Panel de administración para gestión del sistema
- Visualización gráfica de datos de sueño
- Sistema de notificaciones para feedback del usuario

---

## Objetivos del Proyecto

### Objetivo General
Crear una herramienta web accesible y fácil de usar que permita a las personas llevar un registro completo de sus hábitos de salud diarios.

### Objetivos Específicos
1. Permitir que múltiples usuarios mantengan sus datos por separado
2. Asegurar que la información se mantenga entre sesiones
3. Desarrollar una UI/UX que sea fácil de entender y navegar
4. Garantizar compatibilidad con dispositivos móviles y desktop
5. Mostrar información de manera gráfica y comprensible
6. Proporcionar herramientas de gestión para administradores

---

## Tecnologías Utilizadas

### Frontend
- **HTML5**
- **CSS3**
- **JavaScript**

### Almacenamiento
- **localStorage**
- **JSON**

### Herramientas de Desarrollo
- **Visual Studio Code**
- **Git**

### Librerías y Frameworks
- **Sin dependencias externas**: Desarrollo vanilla para mejor rendimiento y control

---

## Estructura del Proyecto

```
Dashboard_Salud_Bienestar/
│
├── index.html                # Página principal
├── css/
│   └── style.css             # Estilos principales
├── js/
│   └── script.js             # Lógica de la aplicación
├── README.md                 # Documentación principal
├── PROMPTS_IA_UTILIZADOS.md  # Registro de prompts utilizados
└── DOCUMENTACION.md          # Este archivo
```

## Funcionalidades Implementadas

### 1. Registro de Consumo de Agua
- **Funcionalidad**: Permite registrar la cantidad de agua consumida
- **Unidad**: Litros con incrementos de 0.25L
- **Visualización**: Barra de progreso hacia meta diaria (2.5L)
- **Persistencia**: Datos guardados por usuario y fecha

### 2. Monitoreo de Sueñoes
- **Funcionalidad**: Registro de horas de sueño por noche
- **Visualización**: Gráfico de barras de los últimos 7 días
- **Características**: 
  - Colores diferentes según calidad de sueño
  - Resaltado del día actual
  - Promedio semanal calculado automáticamente

### 3. Seguimiento de Ejercicio 
- **Tipos de ejercicio**: Cardio, Pesas, Yoga, Correr, Nadar, Ciclismo
- **Métricas**: Duración en minutos y calorías quemadas
- **Cálculo automático**: Calorías estimadas según tipo de ejercicio
- **Acumulativo**: Suma total diaria de tiempo y calorías

### 4. Control de Alimentación
- **Funcionalidad**: Registro de comidas y calorías
- **Características**:
  - Lista de comidas del día
  - Contador total de calorías
  - Opción de eliminar registros
  - Meta diaria configurable

### 5. Navegación de Fechas
- **Funcionalidad**: Cambio entre diferentes días
- **Características**:
  - Navegación con botones anterior/siguiente
  - Selector de fecha directo
  - Datos específicos por fecha
  - Indicador visual del día actual

---

## 🔐 Sistema de Autenticación

### Registro de Usuarios
- **Campos requeridos**: Nombre completo, usuario, email, contraseña
- **Validaciones**: 
  - Todos los campos obligatorios
  - Formato de email válido
  - Confirmación de contraseña
  - Unicidad de usuario y email

### Inicio de Sesión
- **Credenciales**: Usuario y contraseña
- **Persistencia**: Sesión mantenida entre recargas
- **Seguridad**: Datos separados por usuario

### Roles de Usuario
- **Usuario Normal**: Acceso al dashboard personal
- **Administrador**: Acceso al panel de gestión
  - Credenciales: `admin` / `admin123`

---

## 📱 Diseño Responsive

### Breakpoints Implementados
- **Desktop**: > 768px
- **Tablet**: 481px - 768px
- **Mobile**: ≤ 480px

### Adaptaciones por Dispositivo

#### Mobile (≤ 480px)
- Grid de 1 columna para tarjetas principales
- Padding reducido en contenedores
- Tamaño de fuente ajustado
- Botones más grandes para touch

#### Tablet (481px - 768px)
- Grid de 2 columnas
- Espaciado intermedio
- Navegación optimizada

#### Desktop (> 768px)
- Layout completo con todas las columnas
- Máximo aprovechamiento del espacio
- Hover effects activados

---

## Panel de Administrador

### Funcionalidades de Administración

#### Estadísticas del Sistema
- **Usuarios registrados**: Conteo total
- **Usuarios activos**: Login en últimos 7 días
- **Datos almacenados**: Tamaño en KB

#### Gestión de Usuarios
- **Ver lista completa**: Usuarios con fecha de último acceso
- **Eliminar usuarios**: Con confirmación de seguridad
- **Exportar datos**: Backup completo en JSON

#### Mantenimiento del Sistema
- **Limpiar datos antiguos**: Elimina registros > 30 días
- **Generar reportes**: Archivo de texto con estadísticas
- **Reiniciar sistema**: Reset completo con doble confirmación

### Seguridad del Panel
- Acceso solo con credenciales específicas
- Separación completa de interfaces
- Confirmaciones para acciones destructivas


## Manual de Usuario

### Para Usuarios Normales

#### Primer Uso
1. **Registro**: Crear cuenta con datos personales
2. **Login**: Iniciar sesión con credenciales
3. **Dashboard**: Explorar las tarjetas de métricas

#### Uso Diario
1. **Registrar agua**: Click en tarjeta de agua, ingresar cantidad
2. **Anotar sueño**: Click en tarjeta de sueño, ingresar horas
3. **Registrar ejercicio**: Seleccionar tipo y duración
4. **Anotar comidas**: Agregar nombre y calorías
5. **Cambiar fecha**: Usar navegación para ver días anteriores

#### Características Especiales
- **Gráfico de sueño**: Ver tendencia de última semana
- **Progreso visual**: Barras de progreso hacia metas
- **Persistencia**: Datos guardados automáticamente

### Para Administradores

#### Acceso
- Usuario: `admin`
- Contraseña: `admin123`

#### Funciones Principales
1. **Monitoreo**: Ver estadísticas generales del sistema
2. **Gestión**: Administrar usuarios registrados
3. **Mantenimiento**: Limpiar datos y generar reportes
4. **Backup**: Exportar información completa

---

## Consideraciones Técnicas

### Compatibilidad
- **Navegadores**: Todos los navegadores modernos
- **Dispositivos**: Desktop, tablet y móvil
- **Resoluciones**: Desde 320px hasta 4K

### Rendimiento
- **Sin librerías externas**: Carga rápida
- **Código optimizado**: Funciones eficientes
- **Almacenamiento local**: Sin dependencia de servidor

### Seguridad
- **Datos locales**: Información no enviada a servidores
- **Separación de usuarios**: Datos aislados por usuario
- **Validaciones**: Input sanitization básico

### Limitaciones
- **Almacenamiento**: Limitado por localStorage del navegador
- **Backup**: Manual, no automático
- **Colaboración**: No permite uso simultáneo

---

## Posibles Mejoras Futuras

### Funcionalidades Adicionales
1. **Métricas adicionales**: Peso, presión arterial, glucosa
2. **Metas personalizables**: Objetivos ajustables por usuario
3. **Recordatorios**: Notificaciones para registrar datos
4. **Exportación**: PDF y CSV de reportes personales
5. **Gráficos avanzados**: Charts.js para visualizaciones

### Mejoras Técnicas
1. **Base de datos**: Migración a backend real
2. **Autenticación**: JWT y OAuth integration
3. **PWA**: Progressive Web App features
4. **Offline**: Funcionalidad sin conexión
5. **API**: Backend REST para sincronización

---

## Recursos y Referencias Utilizadas

### Iconografía SVG
Para mantener una interfaz moderna y escalable, se desarrollaron iconos personalizados en formato SVG:

#### **Iconos Personalizados Creados**
- **Cruz médica**: Para indicadores de salud general
- **Gota simplificada**: Para seguimiento de hidratación
- **Media luna**: Para monitoreo de sueño
- **Pesas geometricas**: Para ejercicio físico
- **Plato y cubiertos**: Para alimentación

#### **Proceso de Creación**
- **Diseño propio**: Iconos creados desde cero usando formas geométricas básicas
- **Estilo minimalista**: Líneas simples y formas reconocibles
- **Consistencia visual**: Mismo grosor de línea y estilo en todos los iconos

#### **Justificación Técnica de SVG**
- **Escalabilidad**: Los iconos SVG mantienen calidad en cualquier resolución
- **Rendimiento**: Menor peso que imágenes rasterizadas
- **Personalización**: Fácil modificación de colores y estilos via CSS
- **Accesibilidad**: Compatible con lectores de pantalla

### Paleta de Colores
- **Base**: Tema oscuro moderno inspirado en aplicaciones de salud actuales
- **Acentos**: Azul (#3b82f6) para elementos interactivos
- **Estados**: Verde para éxito, rojo para alertas, amarillo para advertencias

### Tipografía
- **Fuente principal**: Inter (Google Fonts)
- **Justificación**: Excelente legibilidad en pantallas y amplio soporte de caracteres

### Metodología de Desarrollo
- **Mobile-first**: Diseño iniciado desde dispositivos móviles
- **Progressive Enhancement**: Funcionalidades agregadas gradualmente
- **Vanilla JavaScript**: Sin dependencias externas para mejor rendimiento

---

## Conclusiones

El Dashboard de Salud y Bienestar cumple exitosamente con los objetivos planteados, proporcionando una herramienta completa y funcional para el seguimiento de hábitos de salud. La aplicación demuestra un sólido entendimiento de tecnologías web fundamentales y mejores prácticas de desarrollo.

### Aprendizajes Obtenidos
- Gestión de estado en aplicaciones JavaScript
- Diseño responsive con CSS Grid y Flexbox
- Almacenamiento de datos con localStorage
- Arquitectura de aplicaciones web front-end
- Principios de UX/UI design
