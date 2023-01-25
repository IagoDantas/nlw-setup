import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { api } from '../lib/axios'
import dayjs from 'dayjs'

interface HabitsListProps {
    date: Date
    onCompletedChanged: (completed: number) => void
}

interface HabitsInfo {
    possibleHabits: Array<{
        id: string,
        title: string,
        createdAt: string,
    }>,
    completedHabits: string[],
}


export function HabitsList({ onCompletedChanged, date }: HabitsListProps) {


    const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>()


    useEffect(() => {
        api.get('day', {
            params: {
                date: date.toISOString(),
            }
        }).then(response => {
            setHabitsInfo(response.data)
        })
    }, [])


    const isDateinPast = dayjs(date)
        .endOf('day')
        .isBefore(new Date)

    async function handleToggleHabit(habitId: string) {

        await api.patch(`/habits/${habitId}/toggle`)

        const isHabitAlreadyCompleted = habitsInfo?.completedHabits.includes(habitId)

        let completedHabits: string[] = []

        if (isHabitAlreadyCompleted) {
            completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId)

            setHabitsInfo({
                possibleHabits: habitsInfo!.possibleHabits,
                completedHabits
            })
        }
        else {
            completedHabits = [...habitsInfo!.completedHabits, habitId]

            setHabitsInfo({
                possibleHabits: habitsInfo!.possibleHabits,
                completedHabits
            })
        }
        onCompletedChanged(completedHabits.length)
    }

    return (
        <div className='flex flex-col mt-6 gap-6'>
            {habitsInfo?.possibleHabits.map(habit => {
                return (
                    <Checkbox.Root
                        key={habit.id}
                        onCheckedChange={() => handleToggleHabit(habit.id)}
                        className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        checked={habitsInfo?.completedHabits.includes(habit.id)}
                        disabled={isDateinPast}
                    >
                        <div
                            className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background"
                        >
                            <Checkbox.Indicator>
                                <Check size={20} className='text-white' />
                            </Checkbox.Indicator>
                        </div>
                        <span className="font-semibold text-xl leading-tight text-white group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                            {habit.title}
                        </span>
                    </Checkbox.Root>

                )
            })}

        </div>

    )
}