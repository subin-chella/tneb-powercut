import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

export async function getPowerCutDetail(shutDownDate:Date, town:string, location:string, substation:string, feeder:string) :Promise<powerCutDetails> {
    const details = await prisma.power_cut_details.findFirst({
        where: {
            shutDownDate: shutDownDate,
            town: town,
            location: location,
            substation: substation,
            feeder: feeder,
        }
    }
    )
    return details;
}


export async function setPowerCutDetail(shutDownDate:Date, town:string, location:string, substation:string, feeder:string) {
    const newPowerCutDetail = await prisma.power_cut_details.create({
        data: {
            shutDownDate: shutDownDate,
            town: town,
            location: location,
            substation: substation,
            feeder: feeder,
            area_ids: "1,2",
          // createdAt is automatically set by the @default(now()) in your schema
        },
      });
    console.log(`powerCutDetails ${newPowerCutDetail}`)
}

