"use client";

import * as React from "react";
import {useMediaQuery} from "@/hooks/use-media-query";
import {Button} from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {Drawer, DrawerContent, DrawerTrigger} from "@/components/ui/drawer";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {currencies, Currency} from "@/lib/currencies";
import {useMutation, useQuery} from "@tanstack/react-query";
import SkeletonWrapper from "@/components/general/skeleton-wrapper";
import {useCallback, useEffect, useState} from "react";
import {UserPreferences} from "@prisma/client";
import updateUserCurrency from "@/app/wizard/_actions/userPreferences";
import {toast} from "sonner";

interface IStatusList {
    setOpen: (open: boolean) => void;
    setSelectedCurrency: (currency: Currency | null) => void;
}

const CurrencyComboBox = () => {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [selectedCurrency, setSelectedCurrency] =
        useState<Currency | null>(null);

    const userPreferences = useQuery<UserPreferences>({
        queryKey: ["userPreferences"],
        queryFn: () => fetch("/api/user-preferences").then((res) => res.json()),
    });

    useEffect(() => {
        if (!userPreferences.data) return
        const userCurrency = currencies.find(currency => currency.value === userPreferences.data.currency)
        if (userCurrency) setSelectedCurrency(userCurrency)
    }, [userPreferences.data]);

    const mutation = useMutation({
        mutationFn: updateUserCurrency,
        onSuccess: (data: UserPreferences) => {
            toast.success("Currency updated successfully", { id: 'update-currency' })
            setSelectedCurrency(currencies.find(c => c.value === data.currency) || null)
        },
        onError: () => toast.error("Something went wrong")
    })


    const selectOption = useCallback( (currency: Currency | null) => {
        if (!currency) {
            toast.error("Please choose a currency", { id: 'update-currency'});
            return
        }

        toast.loading("Updating currency...", { id: 'update-currency' });

        mutation.mutate(currency.value)
    }, [mutation])

    if (isDesktop) {
        return (
            <SkeletonWrapper isLoading={userPreferences.isLoading}>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild className="w-full">
                        <Button variant="outline" className="justify-start w-full" disabled={mutation.isPending}>
                            {selectedCurrency ? (
                                <>{selectedCurrency.label}</>
                            ) : (
                                <>+ Set currency</>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                        <StatusList
                            setOpen={setOpen}
                            setSelectedCurrency={selectOption}
                        />
                    </PopoverContent>
                </Popover>
            </SkeletonWrapper>
        );
    }


    return (
        <SkeletonWrapper isLoading={userPreferences.isLoading}>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button variant="outline" className="w-full justify-start"  disabled={mutation.isPending}>
                        {selectedCurrency ? <>{selectedCurrency.label}</> : <>+ Set currency</>}
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mt-4 border-t">
                        <StatusList
                            setOpen={setOpen}
                            setSelectedCurrency={selectOption}
                        />
                    </div>
                </DrawerContent>
            </Drawer>
        </SkeletonWrapper>
    );
}

const StatusList = ({
                        setOpen,
                        setSelectedCurrency,
                    }: IStatusList) => {
    return (
        <Command className="w-full">
            <CommandInput placeholder="Filter status..."/>
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {currencies.map((item) => (
                        <CommandItem
                            key={item.value}
                            value={item.value}
                            onSelect={(value) => {
                                setSelectedCurrency(
                                    currencies.find((item) => item.value === value) || null
                                );
                                setOpen(false);
                            }}
                        >
                            {item.label}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    );
}

export default CurrencyComboBox