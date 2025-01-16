import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { evaluate } from "mathjs";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [toggleBracket, setToggleBracket] = useState("(");

  const handlePress = (value) => {
    if (value === "=") {
      if (input.trim() === "") {
        setResult("0");
        return;
      }
      try {
        const inputWithPercent = input.replace(/(\d+)%(\d+)/g, (match, num1, num2) => `${num1}/100*${num2}`);
        const inputWithPercentAndDivision = inputWithPercent.replace(/(\d+)%/g, (match, num) => `${num}/100`);

        const evaluation = evaluate(inputWithPercentAndDivision);
        setResult(isNaN(evaluation) ? "0" : evaluation.toString());
      } catch (error) {
        setResult("0");
      }
    } else if (value === "AC") {
      setInput("");
      setResult("");
    } else if (value === "DEL") {
      setInput(input.slice(0, -1));
    } else if (value === "()") {
      // Logic to handle brackets
      const lastChar = input.trim().slice(-1);

      if (toggleBracket === "(") {
        // Add opening bracket only if the last character is not an operator or opening bracket
        if (!["/", "*", "-", "+", "("].includes(lastChar)) {
          setInput(input + "(");
          setToggleBracket(")"); // Now we expect a closing bracket
        }
      } else {
        // Add closing bracket only if there's an opening bracket without a pair
        const openCount = (input.match(/\(/g) || []).length;
        const closeCount = (input.match(/\)/g) || []).length;

        if (openCount > closeCount) {
          setInput(input + ")");
          setToggleBracket("("); // Now we expect an opening bracket again
        }
      }
    } else if (value === "%") {
      if (input.trim() !== "") {
        setInput(input + "%");
      }
    } else if (["/", "*", "-", "+"].includes(value)) {
      const lastChar = input.trim().slice(-1);
      if (["/", "*", "-", "+"].includes(lastChar)) {
        setInput(input.slice(0, -1) + value);
      } else {
        setInput(input + value);
      }
    } else {
      setInput(input + value);
    }
  };

  const buttons = [
    ["AC", "()", "%", "/"],
    ["1", "2", "3", "*"],
    ["4", "5", "6", "+"],
    ["7", "8", "9", "-"],
    [".", "0", "DEL", "="],
  ];

  return (
    <View className={`flex-1 bg-gray-900 p-4 ${Platform.OS === 'ios' ? 'mt-9' : ''}`}>
      {/* Display */}
      <View className="bg-gray-800 rounded-lg mb-4 h-[55%] w-full justify-end">
        <Text className="text-gray-400 text-right text-3xl pr-3">{input || " "}</Text>
        <Text className="text-gray-200 text-right text-6xl py-4 pr-3">{result || " "}</Text>
      </View>

      {/* Buttons */}
      <View className="flex-1">
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-between mb-3">
            {row.map((button) => (
              <TouchableOpacity
                key={button}
                onPress={() => handlePress(button)}
                className={`${button === "="
                  ? "bg-orange-500"
                  : button === "AC"
                    ? "bg-orange-500"
                    : button === "*" || button === "+" || button === "-" || button === "/"
                      ? "bg-gray-700"
                      : "bg-gray-700"
                  } flex-1 mx-1 p-4 rounded-2xl`}
                style={{
                  elevation: 5,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }}
              >
                <Text
                  style={{ fontSize: 20 }}
                  className={`text-center ${button === "=" || button === "AC"
                    ? "text-gray-300"
                    : button === "*" || button === "+" || button === "-" || button === "/" || button === "DEL" || button === "%" || button === "()"
                      ? "text-orange-500"
                      : "text-gray-300"
                    } text-xl font-bold`}
                >
                  {button}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
