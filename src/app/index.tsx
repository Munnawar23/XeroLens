import { ScrollView, Text, View } from "react-native";

export default function Index() {
  return (
    <ScrollView className="flex-1 bg-ui-background">
      <View className="p-6 gap-6">

        {/* HEADER SECTION */}
        <View className="bg-ui-surface p-6 rounded-3xl border border-ui-border shadow-sm">
          <Text className="font-brand text-5xl text-brand-primary">
            XeroLens
          </Text>
          <Text className="font-serif text-xl italic text-ui-muted mt-2">
            Every photo tells a story.
          </Text>
        </View>


        {/* BRAND COLORS */}
        <View className="gap-3">
          <Text className="font-brand text-ui-text text-xl ml-1">Brand Colors</Text>

          <View className="bg-brand-primary p-4 rounded-2xl">
            <Text className="font-brand text-ui-surface text-lg text-center">
              Brand Primary (#9A0500)
            </Text>
          </View>

          <View className="bg-brand-accent p-4 rounded-2xl">
            <Text className="font-brand text-ui-surface text-lg text-center">
              Brand Accent (#E64624)
            </Text>
          </View>

          <View className="bg-brand-soft p-4 rounded-2xl">
            <Text className="font-brand text-ui-text text-lg text-center">
              Brand Soft (#FFAF58)
            </Text>
          </View>

          <View className="bg-brand-highlight p-4 rounded-2xl">
            <Text className="font-brand text-ui-surface text-lg text-center">
              Brand Highlight (#19481E)
            </Text>
          </View>
        </View>


        {/* UI SYSTEM */}
        <View className="gap-3">
          <Text className="font-brand text-ui-text text-xl ml-1">UI System</Text>

          <View className="bg-ui-surface border border-ui-border p-5 rounded-2xl">
            <Text className="font-brand text-ui-text text-2xl">
              Surface Card
            </Text>
            <Text className="font-serif text-ui-text mt-1">
              Primary text sitting on surface.
            </Text>
            <Text className="font-serif text-ui-muted mt-2">
              Muted text for secondary information.
            </Text>
          </View>

          <View className="p-4 rounded-2xl border-2 border-dashed border-ui-border items-center">
            <Text className="font-brand text-ui-muted">
              Border color check
            </Text>
          </View>
        </View>


        {/* FONT TEST */}
        <View className="bg-ui-surface p-5 rounded-2xl border border-ui-border gap-2">
          <Text className="font-brand text-ui-text text-xl mb-2">Typography Check</Text>

          <Text className="font-brand text-3xl text-brand-primary">
            Space Grotesk (Brand)
          </Text>

          <Text className="font-serif text-2xl text-ui-text">
            Playfair Display (Serif)
          </Text>

          <Text className="font-serif italic text-xl text-ui-muted">
            Italic Playfair Display
          </Text>
        </View>

        {/* INTERACTIVE PREVIEW */}
        <View className="bg-brand-accent p-5 rounded-full items-center shadow-lg active:opacity-80">
          <Text className="font-brand text-ui-surface text-xl uppercase tracking-widest">
            Capture Memory
          </Text>
        </View>

      </View>
    </ScrollView>
  );
}
