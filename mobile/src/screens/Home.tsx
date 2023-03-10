
import { View, Text, ScrollView, Alert } from 'react-native';

import { useCallback, useState } from 'react';
import { api } from '../lib/axios'

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Loading } from '../components/Loading';

import { generateRangeBetweenDates } from '../utils/generate-range-between-dates'
import { Header, } from '../components/Header';
import { HabitDay, DAY_SIZE } from '../components/HabitDay';
import dayjs from 'dayjs';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const minimumSummaryDatesSizes = 18 * 5;
const datesFromYearStart = generateRangeBetweenDates()

const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length;


type SummaryProps = Array<{
    id: string;
    date: string;
    amount: number;
    completed: number;
}>

export function Home() {

    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState<SummaryProps | null>(null)


    const { navigate } = useNavigation()

    async function fetchData() {
        try {
            setLoading(true);
            const response = await api.get('/summary');
            setSummary(response.data)
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar o sumário de hábitos')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fetchData();
    }, []));


    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <Header />
            <View className='flex-row mt-6 mb-2'>
                {weekDays.map((weekDay, i) => (
                    <Text
                        style={{ width: DAY_SIZE }}
                        className="text-zinc-400 text-xl font-bold text-center mx-1" key={`${weekDay}-${i}`}
                    >

                        {weekDay}
                    </Text>
                ))}

            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {summary &&
                    <View className="flex-row flex-wrap">
                        {
                            datesFromYearStart.map(date => {

                                const dayWithHabit = summary.find(day => {
                                    return dayjs(date).isSame(day.date, 'day')
                                })
                                return (
                                    <HabitDay
                                        onPress={() => navigate('habit', { date: date.toISOString() })}
                                        key={date.toString()}
                                        date={date}
                                        amountOfHabits={dayWithHabit?.amount}
                                        amountCompleted={dayWithHabit?.completed}
                                    />
                                )
                            })
                        }
                        {
                            amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) =>
                            (
                                <View
                                    key={i}
                                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40" style={{ width: DAY_SIZE, height: DAY_SIZE }}
                                />

                            ))
                        }
                    </View>}
            </ScrollView>
        </View >
    );
}