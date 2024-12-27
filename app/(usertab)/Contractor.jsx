import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';

const { width, height } = Dimensions.get('window');

const data = [
    { id: '1', image: 'https://via.placeholder.com/300', title: 'Card 1' },
    { id: '2', image: 'https://via.placeholder.com/300', title: 'Card 2' },
    { id: '3', image: 'https://via.placeholder.com/300', title: 'Card 3' },
];

const App = () => {
    const [cards, setCards] = useState(data);
    const position = new Animated.ValueXY(); 

    // Tracks card position

    // PanResponder to detect gestures
    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
            position.setValue({ x: gesture.dx, y: gesture.dy });
        },
        onPanResponderRelease: (_, gesture) => {
            if (gesture.dx > 120) {
                // Swipe Right: Remove card
                Animated.timing(position, {
                    toValue: { x: width, y: gesture.dy },
                    duration: 300,
                    useNativeDriver: false,
                }).start(() => {
                    position.setValue({ x: 0, y: 0 });
                    cycleCard(); // Cycle to the next card
                });
            } else if (gesture.dx < -120) {
                // Swipe Left: Reset position
                Animated.spring(position, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start();
            } else {
                // Return to original position
                Animated.spring(position, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start();
            }
        },
    });

    // Function to cycle cards
    const cycleCard = () => {
        setCards((prev) => {
            const [firstCard, ...rest] = prev;
            return [...rest, firstCard]; // Move the first card to the end
        });
    };

    return (
        <View
        className=" flex-1 justify-center items-center "
        // style={styles.container}
        >
            {cards.map((item, index) => {
                // Show only the top card as swipeable
                const isTopCard = index === 0;

                return (
                    <Animated.View
                        key={item.id}
                        style={[
                            styles.card,
                            isTopCard && { transform: position.getTranslateTransform() },
                            { zIndex: cards.length - index },
                        ]}
                        {...(isTopCard ? panResponder.panHandlers : {})}
                    >
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <Text style={styles.title}>{item.title}</Text>
                    </Animated.View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: '#f8f8f8',
    // },

    card: {
        position: 'absolute',
        width: width * 0.8,
        height: height * 0.6,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    image: {
        width: '100%',
        height: '80%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },

    title: {
        padding: 10,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },

});

export default App;
