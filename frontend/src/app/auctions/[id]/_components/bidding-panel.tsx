"use client";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/lib/components/countdown";
import { Auction } from "@/lib/types/auctions.types";
import { FC, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface BiddingPanelProps {
  auction: Auction;
}

const createFormSchema = (currentPrice: number) => {
  const minBid = Math.max(1, currentPrice + 1);
  return z.object({
    bid: z
      .number({ message: "Bitte eine Zahl eingeben" })
      .min(1, { message: "Das Gebot muss mindestens 1€ sein" })
      .min(minBid, {
        message: `Das Gebot muss mindestens ${minBid}€ sein (höher als ${currentPrice}€)`,
      }),
  });
};

export const BiddingPanel: FC<BiddingPanelProps> = ({ auction }) => {
  const formSchema = useMemo(
    () => createFormSchema(auction.currentPrice),
    [auction.currentPrice],
  );

  const { handleSubmit, control } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bid: auction.currentPrice + 1,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  return (
    <div className="p-2 rounded-lg border-zinc-800 flex flex-col ">
      <div className="flex flex-col gap-3">
        <h3 className="text-md font-semibold">Bidding Panel</h3>
        <div className="flex flex-col gap-1 w-full items-center py-2">
          <p className="text-sm font-medium text-muted-foreground">
            Current Price
          </p>
          <p className="text-4xl font-bold text-emerald-600">
            {auction.currentPrice}€
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full text-center border-b pb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Offer count
            </p>
            <p>{auction.offers?.length}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Time left
            </p>
            <Countdown endDate={auction.endDate} />
          </div>
        </div>
        <div>
          <p className="text-md font-semibold">Quick Bid</p>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Button>+50€</Button>
            <Button>+100€</Button>
            <Button>+200€</Button>
          </div>
        </div>
        <form id="bid-form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="bid"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel className="text-md font-semibold">
                  Custom Bid
                </FieldLabel>
                <Input
                  {...field}
                  type="number"
                  id="bid-form-bid-field"
                  aria-invalid={fieldState.invalid}
                  inputMode="numeric"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button type="submit" form="bid-form" className={"mt-1 w-full"}>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};
