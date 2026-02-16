import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  useDrawerProgress,
} from "@react-navigation/drawer";
import { router, usePathname } from "expo-router";
import React, { useState } from "react";
import { Platform, Switch, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Extrapolate,
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

interface DrawerItemProps {
  label: string;
  icon: any;
  isActive: boolean;
  onPress: () => void;
  index: number;
  progress: any;
}

const CustomDrawerItem = ({
  label,
  icon,
  isActive,
  onPress,
  index,
  progress,
}: DrawerItemProps) => {
  const springProgress = useDerivedValue(() => {
    return withSpring(progress.value, {
      damping: 20,
      stiffness: 90,
      mass: 1,
    });
  });

  const animatedStyle = useAnimatedStyle(() => {
    const startOffset = index * 0.05;
    const adjustedProgress = interpolate(
      springProgress.value,
      [startOffset, 1],
      [0, 1],
      Extrapolate.CLAMP,
    );

    const translateX = interpolate(adjustedProgress, [0, 1], [-20, 0]);
    const opacity = interpolate(adjustedProgress, [0, 0.5, 1], [0, 0, 1]);
    const scale = interpolate(adjustedProgress, [0, 1], [0.95, 1]);

    return {
      opacity,
      transform: [{ translateX }, { scale }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderRadius: 16,
          marginBottom: 6,
          backgroundColor: isActive ? "#CF2A2A" : "transparent",
        }}
      >
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isActive ? "#F3A712" : "#153272",
          }}
        >
          <Ionicons
            name={icon}
            size={20}
            color={isActive ? "#1E459F" : "#FFFFFF"}
          />
        </View>
        <Text
          style={{
            marginLeft: 16,
            fontSize: 17,
            color: "#FFFFFF",
            fontFamily: isActive
              ? "SpaceGrotesk-Bold"
              : "SpaceGrotesk-SemiBold",
          }}
        >
          {label}
        </Text>
        {isActive && (
          <View
            style={{
              marginLeft: "auto",
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: "#F3A712",
            }}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export function CustomDrawerContent(props: any) {
  const { navigation } = props;
  const progress = useDrawerProgress();
  const pathname = usePathname();
  const [currentView, setCurrentView] = useState<"main" | "notifications">(
    "main",
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const headerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [-10, 0]);
    const opacity = interpolate(progress.value, [0, 0.5, 1], [0, 0, 1]);
    return { opacity, transform: [{ translateY }] };
  });

  const footerStyle = useAnimatedStyle(() => {
    const springVal = withSpring(progress.value, {
      damping: 15,
      stiffness: 100,
    });
    const scale = interpolate(springVal, [0, 1], [0.4, 1]);
    const opacity = interpolate(progress.value, [0, 0.5, 1], [0, 0, 1]);
    const rotate = interpolate(progress.value, [0, 1], [-45, 0]);

    return {
      opacity,
      transform: [{ scale }, { rotate: `${rotate}deg` }],
    };
  });

  const handleNavigate = (path: any) => {
    navigation.closeDrawer();
    router.navigate(path);
  };

  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled={false}
      contentContainerStyle={{ flex: 1, backgroundColor: "#1E459F" }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 40,
        }}
      >
        {currentView === "main" ? (
          <Animated.View
            key="main-view"
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(300)}
            style={{ flex: 1 }}
          >
            {/* Header Section */}
            <Animated.View style={[headerStyle, { marginBottom: 32 }]}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    backgroundColor: "#1E459F",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "#FFFFFF",
                  }}
                >
                  <Ionicons name="settings-sharp" size={24} color="#F3A712" />
                </View>
                <View style={{ marginLeft: 16 }}>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 28,
                      fontFamily: "SpaceGrotesk-Bold",
                    }}
                  >
                    Settings
                  </Text>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 10,
                      opacity: 0.6,
                      fontFamily: "SpaceGrotesk-SemiBold",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    Control Center
                  </Text>
                </View>
              </View>
            </Animated.View>

            {/* Navigation Items */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#F3A712",
                  opacity: 0.8,
                  fontSize: 10,
                  fontFamily: "SpaceGrotesk-SemiBold",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  marginBottom: 16,
                  marginLeft: 8,
                }}
              >
                Quick Access
              </Text>

              <CustomDrawerItem
                label="Camera"
                icon="camera"
                index={0}
                progress={progress}
                isActive={pathname === "/"}
                onPress={() => handleNavigate("/")}
              />
              <CustomDrawerItem
                label="Library"
                icon="images"
                index={1}
                progress={progress}
                isActive={pathname === "/library"}
                onPress={() => handleNavigate("/library")}
              />
              <CustomDrawerItem
                label="Studio"
                icon="color-palette"
                index={2}
                progress={progress}
                isActive={pathname === "/studio"}
                onPress={() => handleNavigate("/studio")}
              />
              <CustomDrawerItem
                label="Notifications"
                icon="notifications"
                index={3}
                progress={progress}
                isActive={false}
                onPress={() => setCurrentView("notifications")}
              />
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            key="notifications-view"
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(300)}
            style={{ flex: 1 }}
          >
            {/* Notifications Header */}
            <TouchableOpacity
              onPress={() => setCurrentView("main")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 32,
              }}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 22,
                  fontFamily: "SpaceGrotesk-Bold",
                  marginLeft: 8,
                }}
              >
                Notifications
              </Text>
            </TouchableOpacity>

            <View
              style={{
                backgroundColor: "#CF2A2A",
                padding: 20,
                borderRadius: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 17,
                      fontFamily: "SpaceGrotesk-Bold",
                    }}
                  >
                    Push Notifications
                  </Text>
                  <Text
                    style={{
                      color: "#E1DCCA",
                      fontSize: 13,
                      fontFamily: "SpaceGrotesk-SemiBold",
                      marginTop: 4,
                    }}
                  >
                    Receive alerts about new studio updates.
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#153272", true: "#F3A712" }}
                  thumbColor={
                    Platform.OS === "ios"
                      ? "white"
                      : notificationsEnabled
                        ? "#F3A712"
                        : "#E1DCCA"
                  }
                />
              </View>
            </View>

            <View style={{ flex: 1 }} />
          </Animated.View>
        )}

        {/* Beautiful Close Button */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 20,
          }}
        >
          <Animated.View style={footerStyle}>
            <TouchableOpacity
              onPress={() => {
                navigation.closeDrawer();
                setTimeout(() => setCurrentView("main"), 300);
              }}
              activeOpacity={0.8}
            >
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  backgroundColor: "#CF2A2A",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#FFFFFF",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="close" size={30} color="#F3A712" />
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}
