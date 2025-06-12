"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

const DAY_NAMES = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
] as const;

export interface DaySchedule {
    isOpen: boolean
    openingTime: string
    closingTime: string
}

export interface WeeklySchedule {
    sunday: DaySchedule
    monday: DaySchedule
    tuesday: DaySchedule
    wednesday: DaySchedule
    thursday: DaySchedule
    friday: DaySchedule
    saturday: DaySchedule
}

export interface WeeklyScheduleEditorProps {
    value: WeeklySchedule
    onChange: (schedule: WeeklySchedule) => void
}

const defaultDay: DaySchedule = {
    isOpen: true,
    openingTime: "08:00",
    closingTime: "22:00",
}

export const defaultWeeklySchedule: WeeklySchedule = {
    sunday: { ...defaultDay, openingTime: "09:00", closingTime: "20:00" },
    monday: { ...defaultDay },
    tuesday: { ...defaultDay },
    wednesday: { ...defaultDay },
    thursday: { ...defaultDay },
    friday: { ...defaultDay },
    saturday: { ...defaultDay, openingTime: "09:00", closingTime: "22:00" },
}

const dayNames = [
    { key: "sunday", label: "Domingo", shortLabel: "Dom" },
    { key: "monday", label: "Segunda", shortLabel: "Seg" },
    { key: "tuesday", label: "Terça", shortLabel: "Ter" },
    { key: "wednesday", label: "Quarta", shortLabel: "Qua" },
    { key: "thursday", label: "Quinta", shortLabel: "Qui" },
    { key: "friday", label: "Sexta", shortLabel: "Sex" },
    { key: "saturday", label: "Sábado", shortLabel: "Sáb" },
] as const

export function WeeklyScheduleEditor({ value, onChange }: WeeklyScheduleEditorProps) {
    const [schedule, setSchedule] = useState<WeeklySchedule>(value)

    const updateDay = (day: keyof WeeklySchedule, updates: Partial<DaySchedule>) => {
        const updatedSchedule = {
            ...schedule,
            [day]: {
                ...schedule[day],
                ...updates,
            },
        }
        setSchedule(updatedSchedule)
        onChange(updatedSchedule)
    }

    const applyToAllDays = (template: keyof WeeklySchedule) => {
        const templateDay = schedule[template]
        const updatedSchedule = { ...schedule }

        dayNames.forEach(({ key }) => {
            if (key !== template) {
                updatedSchedule[key as keyof WeeklySchedule] = { ...templateDay }
            }
        })

        setSchedule(updatedSchedule)
        onChange(updatedSchedule)
    }

    // TODO - This logic is not intuitive, consider refactoring
    const applyToWeekdays = () => {
        const updatedSchedule = { ...schedule }
        const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"]

        // Use Monday as template
        const template = schedule.monday

        weekdays.forEach((day) => {
            updatedSchedule[day as keyof WeeklySchedule] = { ...template }
        })

        setSchedule(updatedSchedule)
        onChange(updatedSchedule)
    }

    const applyToWeekends = () => {
        const updatedSchedule = { ...schedule }
        const weekends = ["saturday", "sunday"]

        // Use Saturday as template
        const template = schedule.saturday

        weekends.forEach((day) => {
            updatedSchedule[day as keyof WeeklySchedule] = { ...template }
        })

        setSchedule(updatedSchedule)
        onChange(updatedSchedule)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="cursor-pointer hover:bg-slate-100" onClick={() => applyToWeekdays()}>
                    Aplicar a dias úteis
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-slate-100" onClick={() => applyToWeekends()}>
                    Aplicar a finais de semana
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {dayNames.map(({ key, label, shortLabel }) => (
                    <Card key={key} className={!schedule[key as keyof WeeklySchedule].isOpen ? "opacity-75" : ""}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 text-slate-500 mr-2" />
                                    <Label htmlFor={`${key}-switch`} className="font-medium">
                                        <span className="hidden sm:inline">{label}</span>
                                        <span className="sm:hidden">{shortLabel}</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id={`${key}-switch`}
                                        checked={schedule[key as keyof WeeklySchedule].isOpen}
                                        onCheckedChange={(checked) => updateDay(key as keyof WeeklySchedule, { isOpen: checked })}
                                    />
                                    <Label htmlFor={`${key}-switch`} className="text-sm text-slate-500">
                                        {schedule[key as keyof WeeklySchedule].isOpen ? "Aberto" : "Fechado"}
                                    </Label>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor={`${key}-opening`} className="text-xs text-slate-500 mb-1 block">
                                        Abertura
                                    </Label>
                                    <Input
                                        id={`${key}-opening`}
                                        type="time"
                                        value={schedule[key as keyof WeeklySchedule].openingTime}
                                        onChange={(e) => updateDay(key as keyof WeeklySchedule, { openingTime: e.target.value })}
                                        disabled={!schedule[key as keyof WeeklySchedule].isOpen}
                                        className="h-8"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`${key}-closing`} className="text-xs text-slate-500 mb-1 block">
                                        Fechamento
                                    </Label>
                                    <Input
                                        id={`${key}-closing`}
                                        type="time"
                                        value={schedule[key as keyof WeeklySchedule].closingTime}
                                        onChange={(e) => updateDay(key as keyof WeeklySchedule, { closingTime: e.target.value })}
                                        disabled={!schedule[key as keyof WeeklySchedule].isOpen}
                                        className="h-8"
                                    />
                                </div>
                            </div>

                            {key !== "sunday" && (
                                <button
                                    type="button"
                                    onClick={() => applyToAllDays(key as keyof WeeklySchedule)}
                                    className="text-xs text-slate-500 mt-2 hover:text-slate-700 underline"
                                >
                                    Aplicar a todos os dias
                                </button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

// Função para converter o WeeklySchedule para o formato de array para o backend
export function convertScheduleToArray(schedule: WeeklySchedule): Array<{
    weekday: number
    is_open: boolean
    opening_time: string
    closing_time: string
}> {
    return DAY_NAMES.map((day, index) => {
        const daySchedule = schedule[day]
        return {
            weekday: index,
            is_open: daySchedule.isOpen,
            opening_time: `1970-01-01T${daySchedule.openingTime}:00Z`,
            closing_time: `1970-01-01T${daySchedule.closingTime}:00Z`,
        }
    })
}

// Função para converter o array do backend para o formato WeeklySchedule
export function convertArrayToSchedule(
    scheduleArray:
        | Array<{
            isOpen: boolean
            openingTime: string
            closingTime: string
        }>
        | undefined,
): WeeklySchedule {
    if (!scheduleArray || scheduleArray.length !== 7) {
        return defaultWeeklySchedule
    }

    return {
        sunday: scheduleArray[0],
        monday: scheduleArray[1],
        tuesday: scheduleArray[2],
        wednesday: scheduleArray[3],
        thursday: scheduleArray[4],
        friday: scheduleArray[5],
        saturday: scheduleArray[6],
    }
}
