import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, RADII, SHADOW } from "../utils/theme";

const RESTAURANTS = [
  {
    id: "r1",
    name: "Golden Panda",
    cuisine: "Chinese",
    price: "$$",
    eta: "20-30 min",
    address: "5688 University Blvd, Vancouver, BC",
    items: [
      { id: "i1", name: "Fried Rice", price: 14 },
      { id: "i2", name: "Sweet and Sour Chicken", price: 18 },
      { id: "i3", name: "Dumplings", price: 9 },
    ],
  },
  {
    id: "r2",
    name: "Bella Pasta",
    cuisine: "Italian",
    price: "$$",
    eta: "25-35 min",
    address: "2155 Western Pkwy, Vancouver, BC",
    items: [
      { id: "i4", name: "Spaghetti", price: 16 },
      { id: "i5", name: "Lasagna", price: 19 },
      { id: "i6", name: "Caesar Salad", price: 11 },
    ],
  },
  {
    id: "r3",
    name: "Fresh Bowl",
    cuisine: "Healthy",
    price: "$",
    eta: "15-25 min",
    address: "5720 Agronomy Rd, Vancouver, BC",
    items: [
      { id: "i7", name: "Chicken Bowl", price: 13 },
      { id: "i8", name: "Veggie Bowl", price: 12 },
      { id: "i9", name: "Smoothie", price: 7 },
    ],
  },
  {
    id: "r4",
    name: "Burger Corner",
    cuisine: "American",
    price: "$",
    eta: "15-20 min",
    address: "5754 Dalhousie Rd, Vancouver, BC",
    items: [
      { id: "i10", name: "Cheeseburger", price: 12 },
      { id: "i11", name: "Fries", price: 5 },
      { id: "i12", name: "Chicken Burger", price: 13 },
    ],
  },
  {
    id: "r5",
    name: "McDonald's",
    cuisine: "Fast Food",
    price: "$",
    eta: "10-20 min",
    address: "5728 University Blvd #101, Vancouver, BC V6T 1K6",
    items: [
      { id: "m1", name: "Big Mac", price: 8 },
      { id: "m2", name: "McFlurry", price: 5 },
      { id: "m3", name: "McChicken", price: 7 },
      { id: "m4", name: "French Fries", price: 4 },
      { id: "m5", name: "Chicken Nuggets", price: 6 },
      { id: "m6", name: "Coke", price: 3 },
    ],
  },
];

const CUISINES = [
  "Chinese",
  "Italian",
  "Healthy",
  "American",
  "Fast Food",
];

export default function FoodOrderScreen({ navigation }) {
  const [step, setStep] = useState("choose_cuisine");
  const [cuisine, setCuisine] = useState("");
  const [search, setSearch] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const guideText = useMemo(() => {
    if (step === "choose_cuisine") {
      return "Step 1: Choose the kind of food you would like. You can tap a category such as Fast Food, or search manually.";
    }
    if (step === "choose_restaurant") {
      return "Step 2: Choose a restaurant. Large cards make it easier to select where you want to order from.";
    }
    if (step === "choose_items") {
      return "Step 3: Choose your food items. Tap Add for the dishes you want.";
    }
    if (step === "enter_address") {
      return "Step 4: Enter your delivery address so the order can be delivered to the right place.";
    }
    if (step === "review_checkout") {
      return "Step 5: Review your order and delivery address. This is the final checkout step in the prototype.";
    }
    return "I’m here to guide you through ordering food.";
  }, [step]);

  const filteredRestaurants = useMemo(() => {
    let data = RESTAURANTS;

    if (cuisine) {
      data = data.filter(
        (r) => r.cuisine.toLowerCase() === cuisine.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      data = data.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q)
      );
    }

    return data;
  }, [cuisine, search]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  }, [cart]);

  const addItem = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const removeItem = (indexToRemove) => {
    setCart((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleCuisineSelect = (value) => {
    setCuisine(value);
    setSearch("");
    setStep("choose_restaurant");
  };

  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setCart([]);
    setDeliveryAddress("");
    setStep("choose_items");
  };

  const handleContinueFromSearch = () => {
    setCuisine("");
    setStep("choose_restaurant");
  };

  const handleGoToAddress = () => {
    if (!cart.length) {
      Alert.alert("Cart is empty", "Please add at least one item first.");
      return;
    }
    setStep("enter_address");
  };

  const handleGoToCheckout = () => {
    if (!deliveryAddress.trim()) {
      Alert.alert("Address needed", "Please enter a delivery address.");
      return;
    }
    setStep("review_checkout");
  };

  const handlePlaceOrder = () => {
    Alert.alert(
      "Prototype Checkout Complete",
      "This is the checkout step of the simulation. No real order has been placed."
    );
  };

  const renderCuisineStep = () => (
    <View>
      <Text style={styles.sectionTitle}>What would you like to eat?</Text>

      <View style={styles.chipWrap}>
        {CUISINES.map((item) => (
          <TouchableOpacity
            key={item}
            style={styles.chip}
            onPress={() => handleCuisineSelect(item)}
          >
            <Text style={styles.chipText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
        Or search manually
      </Text>

      <View style={styles.searchBox}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search restaurant or cuisine..."
          placeholderTextColor={COLORS.muted}
          style={styles.searchInput}
        />
      </View>

      {!!search.trim() && (
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleContinueFromSearch}
        >
          <Text style={styles.primaryBtnText}>Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderRestaurantStep = () => (
    <View>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Choose a restaurant</Text>
        <TouchableOpacity onPress={() => setStep("choose_cuisine")}>
          <Text style={styles.linkText}>Change</Text>
        </TouchableOpacity>
      </View>

      {filteredRestaurants.map((restaurant) => (
        <TouchableOpacity
          key={restaurant.id}
          style={styles.card}
          onPress={() => handleRestaurantSelect(restaurant)}
        >
          <Text style={styles.cardTitle}>{restaurant.name}</Text>
          <Text style={styles.cardMeta}>
            {restaurant.cuisine} · {restaurant.price} · {restaurant.eta}
          </Text>
          <Text style={styles.cardAddress}>{restaurant.address}</Text>
          <Text style={styles.cardSub}>Tap to view menu</Text>
        </TouchableOpacity>
      ))}

      {!filteredRestaurants.length && (
        <Text style={styles.emptyText}>
          No restaurants matched that search. Try another keyword or food type.
        </Text>
      )}
    </View>
  );

  const renderItemsStep = () => (
    <View>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>{selectedRestaurant?.name}</Text>
        <TouchableOpacity onPress={() => setStep("choose_restaurant")}>
          <Text style={styles.linkText}>Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.cardMeta}>
        {selectedRestaurant?.cuisine} · {selectedRestaurant?.eta}
      </Text>
      <Text style={styles.cardAddress}>{selectedRestaurant?.address}</Text>

      <View style={{ marginTop: 14 }}>
        {selectedRestaurant?.items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
            </View>

            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => addItem(item)}
            >
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleGoToAddress}>
        <Text style={styles.primaryBtnText}>
          Continue ({cart.length} items)
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAddressStep = () => (
    <View>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <TouchableOpacity onPress={() => setStep("choose_items")}>
          <Text style={styles.linkText}>Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>
        Enter the address where you want your food delivered.
      </Text>

      <View style={styles.searchBox}>
        <TextInput
          value={deliveryAddress}
          onChangeText={setDeliveryAddress}
          placeholder="Enter delivery address..."
          placeholderTextColor={COLORS.muted}
          style={styles.searchInput}
          multiline
        />
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleGoToCheckout}>
        <Text style={styles.primaryBtnText}>Go to Checkout</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCheckoutStep = () => (
    <View>
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Checkout</Text>
        <TouchableOpacity onPress={() => setStep("enter_address")}>
          <Text style={styles.linkText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Restaurant</Text>
        <Text style={styles.summaryText}>{selectedRestaurant?.name}</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Items</Text>
        {cart.map((item, index) => (
          <View key={`${item.id}_${index}`} style={styles.cartRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryText}>{item.name}</Text>
            </View>
            <Text style={styles.summaryText}>${item.price}</Text>
            <TouchableOpacity onPress={() => removeItem(index)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Delivery Address</Text>
        <Text style={styles.summaryText}>{deliveryAddress}</Text>
      </View>

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${cartTotal}</Text>
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={handlePlaceOrder}>
        <Text style={styles.primaryBtnText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={[COLORS.bgTop, COLORS.bgBottom]} style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.topIconBtn}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={20}
            color={COLORS.gold2}
          />
          <Text style={styles.topIconText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.brand}>UBICA FOOD</Text>

        <View style={{ width: 70 }} />
      </View>

      <View style={styles.guideBox}>
        <Text style={styles.guideTitle}>Voice Guide</Text>
        <Text style={styles.guideText}>{guideText}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {step === "choose_cuisine" && renderCuisineStep()}
        {step === "choose_restaurant" && renderRestaurantStep()}
        {step === "choose_items" && renderItemsStep()}
        {step === "enter_address" && renderAddressStep()}
        {step === "review_checkout" && renderCheckoutStep()}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = {
  topBar: {
    paddingTop: 44,
    paddingHorizontal: 18,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topIconBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "rgba(14,26,51,0.5)",
  },
  topIconText: {
    color: COLORS.gold2,
    fontWeight: "800",
    fontSize: 12,
  },
  brand: {
    color: COLORS.gold2,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1.4,
  },
  guideBox: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: RADII.xl,
    backgroundColor: "rgba(14,26,51,0.72)",
    padding: 14,
    ...SHADOW.glow,
  },
  guideTitle: {
    color: COLORS.gold2,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },
  guideText: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "650",
  },
  content: {
    padding: 16,
    paddingBottom: 60,
  },
  sectionTitle: {
    color: COLORS.gold2,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(14,26,51,0.6)",
  },
  chipText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  searchBox: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 16,
    backgroundColor: "rgba(14,26,51,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchInput: {
    color: COLORS.text,
    fontSize: 16,
    paddingVertical: 10,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  linkText: {
    color: COLORS.gold2,
    fontSize: 14,
    fontWeight: "700",
  },
  card: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 18,
    backgroundColor: "rgba(14,26,51,0.72)",
    padding: 14,
    marginBottom: 12,
    ...SHADOW.glow,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  cardMeta: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardAddress: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
    marginBottom: 6,
  },
  cardSub: {
    color: COLORS.gold2,
    fontSize: 14,
    fontWeight: "700",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 16,
    backgroundColor: "rgba(14,26,51,0.72)",
    padding: 14,
    marginBottom: 12,
  },
  itemName: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "750",
    marginBottom: 4,
  },
  itemPrice: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  addBtn: {
    backgroundColor: COLORS.gold2,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  addBtnText: {
    color: COLORS.bgBottom,
    fontSize: 15,
    fontWeight: "800",
  },
  primaryBtn: {
    marginTop: 14,
    backgroundColor: COLORS.gold2,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: COLORS.bgBottom,
    fontSize: 17,
    fontWeight: "800",
  },
  label: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
    opacity: 0.95,
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 16,
    backgroundColor: "rgba(14,26,51,0.72)",
    padding: 14,
    marginBottom: 12,
  },
  summaryTitle: {
    color: COLORS.gold2,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
  },
  summaryText: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "650",
  },
  cartRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  removeText: {
    color: COLORS.gold2,
    fontSize: 13,
    fontWeight: "700",
  },
  totalBox: {
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 16,
    backgroundColor: "rgba(14,26,51,0.72)",
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
  },
  totalValue: {
    color: COLORS.gold2,
    fontSize: 18,
    fontWeight: "900",
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
    marginTop: 8,
  },
};