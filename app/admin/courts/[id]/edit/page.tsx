"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import api from "@/lib/axios";
import { useAuth } from "@/contexts/auth-context";
import {
  WeeklyScheduleEditor,
  defaultWeeklySchedule,
  convertScheduleToArray,
  convertArrayToSchedule,
  type WeeklySchedule,
} from "@/components/court/weekly-schedule-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mapCourtApi } from "@/utils/mapping";
import { RATE, TRANSFER_FEE } from "@/utils/rate";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calculator } from "lucide-react";

const courtFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  sportType: z.string({ required_error: "Selecione o tipo de quadra" }),
  hourlyPrice: z.coerce
    .number()
    .positive({ message: "Preço deve ser maior que zero" }),
  capacity: z.coerce.number().int().positive().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type CourtFormValues = z.infer<typeof courtFormSchema>;

export default function EditCourtPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fotos, setFotos] = useState<FileList | null>(null);
  const [fotosExistentes, setFotosExistentes] = useState<string[]>([]);
  const [fotosParaRemover, setFotosParaRemover] = useState<string[]>([]);
  const { id } = useParams() as { id: string };
  const { token, companyId } = useAuth();
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>(
    defaultWeeklySchedule
  );

  const form = useForm<CourtFormValues>({
    resolver: zodResolver(courtFormSchema),
    defaultValues: {
      name: "",
      sportType: "",
      hourlyPrice: 0,
      capacity: undefined,
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    const fetchCourt = async () => {
      setIsLoading(true);
      try {
        if (!token) return;
        const response = await api.get(`/admin/courts/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const court = mapCourtApi(response.data);

        form.reset({
          name: court.name,
          sportType: court.sportType,
          hourlyPrice: court.hourlyPrice,
          capacity: court.capacity,
          description: court.description || "",
          isActive: court.isActive,
        });

        const scheduleArray = convertArrayToSchedule(court.courtSchedule || []);
        setWeeklySchedule(scheduleArray);
        //setFotosExistentes(court.photos)
      } catch (error) {
        console.error("Erro ao buscar dados da quadra:", error);
        toast({
          title: "Erro ao carregar dados",
          description:
            "Não foi possível carregar os detalhes da quadra para edição.",
          variant: "destructive",
        });
        router.push("/admin/courts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourt();
  }, [id, form, toast, router, token]);

  const onSubmit = async (data: CourtFormValues) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append(
        "court_info",
        JSON.stringify({
          name: data.name,
          company_id: companyId,
          sport_type: data.sportType,
          hourly_price: data.hourlyPrice,
          capacity: data.capacity,
          description: data.description,
          is_active: data.isActive,
        })
      );

      // TODO - Check how to send photos to the backend
      //fotosParaRemover.forEach((foto, index) => {
      //    formData.append(`remover_foto_${index}`, foto)
      //})

      //if (fotos) {
      //    Array.from(fotos).forEach((file, index) => {
      //        formData.append(`foto_${index}`, file)
      //    })
      //}
      //
      const scheduleArray = convertScheduleToArray(weeklySchedule);
      formData.append("schedule", JSON.stringify(scheduleArray));

      const response = await api.put(`/admin/courts/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast({
          title: "Quadra atualizada com sucesso!",
          description: `A quadra ${data.name} foi atualizada com sucesso.`,
        });

        router.push(`/admin/courts/${id}`);
      } else {
        toast({
          title: "Erro ao atualizar quadra",
          description:
            "Não foi possível atualizar a quadra. Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar quadra:", error);
      toast({
        title: "Erro ao atualizar quadra",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao atualizar a quadra",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFotos(e.target.files);
    }
  };

  const handleRemoveFoto = (foto: string) => {
    setFotosExistentes(fotosExistentes.filter((f) => f !== foto));
    setFotosParaRemover([...fotosParaRemover, foto]);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar activePage="quadras" />
        <div className="flex-1">
          <AdminHeader title="Editar Quadra" />
          <main className="p-6">
            <div className="flex justify-center items-center h-[60vh]">
              <div className="animate-pulse text-slate-600">
                Carregando dados da quadra...
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar activePage="quadras" />
      <div className="flex-1">
        <AdminHeader title="Editar Quadra" />
        <main className="p-6">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/courts/${id}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para detalhes
            </Button>
          </div>

          <Card>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle>Editar Quadra</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="info">
                    <TabsList className="mb-6">
                      <TabsTrigger value="info">
                        Informações Básicas
                      </TabsTrigger>
                      <TabsTrigger value="horarios">
                        Horários de Funcionamento
                      </TabsTrigger>
                      <TabsTrigger value="fotos">Fotos</TabsTrigger>
                    </TabsList>

                    <TabsContent value="info" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome da Quadra</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ex: Quadra de Futsal Coberta"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="sportType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Quadra</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o sportType" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="futsal">Futsal</SelectItem>
                                  <SelectItem value="society">
                                    Society
                                  </SelectItem>
                                  <SelectItem value="volei">Vôlei</SelectItem>
                                  <SelectItem value="beach-tennis">
                                    Beach Tennis
                                  </SelectItem>
                                  <SelectItem value="tenis">Tênis</SelectItem>
                                  <SelectItem value="basquete">
                                    Basquete
                                  </SelectItem>
                                  <SelectItem value="outro">Outro</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                          <FormField
                            control={form.control}
                            name="hourlyPrice"
                            render={({ field }) => {
                              const basePrice = Number(field.value || 0);
                              const clientPrice = useMemo(() => {
                                return (
                                  basePrice * RATE +
                                  TRANSFER_FEE
                                ).toFixed(2);
                              }, [basePrice]);

                              return (
                                <>
                                  <FormItem>
                                    <FormLabel>Preço por Hora (R$)</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>

                                  <div className="flex items-center mt-2">
                                    <p className="text-sm text-gray-500">
                                      O seu cliente verá este preço:{" "}
                                      <span className="font-semibold text-gray-700">
                                        R$ {clientPrice}
                                      </span>
                                    </p>

                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <button
                                          type="button"
                                          className="text-gray-600 hover:text-primary px-2"
                                          aria-label="Ver cálculo"
                                        >
                                          <Calculator className="h-5 w-5" />
                                        </button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-64 text-sm text-gray-700">
                                        <p>
                                          Preço digitado:{" "}
                                          <strong>
                                            R$ {basePrice.toFixed(2)}
                                          </strong>
                                        </p>
                                        <p>
                                          + 5% de taxa:{" "}
                                          <strong>
                                            R$ {(basePrice * 0.05).toFixed(2)}
                                          </strong>
                                        </p>
                                        <p>+ R$ 0,85 de taxa fixa</p>
                                        <hr className="my-2" />
                                        <p>
                                          <strong>
                                            Total exibido: R$ {clientPrice}
                                          </strong>
                                        </p>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                </>
                              );
                            }}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="capacity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Capacidade (pessoas)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  placeholder="10"
                                  {...field}
                                  value={field.value || ""}
                                  onChange={(e) => {
                                    const value =
                                      e.target.value === ""
                                        ? undefined
                                        : Number.parseInt(e.target.value);
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {
                        //     <FormField
                        //         control={form.control}
                        //         name="endereco"
                        //         render={({ field }) => (
                        //             <FormItem>
                        //                 <FormLabel>Endereço</FormLabel>
                        //                 <FormControl>
                        //                     <Input placeholder="Endereço da quadra" {...field} value={field.value || ""} />
                        //                 </FormControl>
                        //                 <FormMessage />
                        //             </FormItem>
                        //         )}
                        //     />
                      }

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Descreva detalhes sobre a quadra, como dimensões, sportType de piso, etc."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>
                              Quadra ativa e disponível para reservas
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="horarios">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium mb-2">
                            Horários de Funcionamento
                          </h3>
                          <p className="text-sm text-slate-500 mb-4">
                            Configure os horários de funcionamento para cada dia
                            da semana. Você pode marcar dias em que a quadra não
                            abre.
                          </p>
                        </div>

                        <WeeklyScheduleEditor
                          value={weeklySchedule}
                          onChange={setWeeklySchedule}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="fotos">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="fotos">Fotos da Quadra</Label>
                          <Input
                            id="fotos"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-2"
                          />
                          <p className="text-sm text-slate-500 mt-1">
                            Você pode selecionar múltiplas fotos. Formatos
                            aceitos: JPG, PNG.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/admin/courts/${id}`)}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary-heavy"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Atualizando...
                      </>
                    ) : (
                      "Atualizar Quadra"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </main>
      </div>
    </div>
  );
}
