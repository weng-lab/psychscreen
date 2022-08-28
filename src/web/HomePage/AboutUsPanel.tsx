import React from 'react';
import { Grid, Container, GridProps } from '@mui/material';
import { Button, Typography } from '@zscreen/psychscreen-ui-components';

const AboutUsPanel: React.FC<GridProps> = props => (
    <Grid container {...props}>
        <Grid item sm={12}>
            <Container style={{ marginLeft: "160px", width: "741px" }}>
                <Typography
                    type="body"
                    size="medium"
                    style={{ fontSize: "32px", lineHeight: "38.4px", fontWeight: 700 }}
                >
                    About Us
                </Typography>
            </Container>
        </Grid>
        <Grid item sm={6}>
            <Container style={{ marginLeft: "200px", marginTop: "100px" }}>
                <Typography
                    type="body"
                    size="medium"
                    style={{ fontSize: "16px", lineHeight: "24px", letterSpacing: "0.5px", marginBottom: "40px", width: "497px" }}
                >
                    PsychSCREEN is a comprehensive catalog of genetic and epigenetic knowledge about the human brain. It was designed and built by Dr. Zhiping Weng's
                    lab at UMass Chan Medical School as a product of the PsychENCODE Consortium.
                </Typography>
                <Button bvariant='outlined' btheme='light'>Learn More</Button>
            </Container>
        </Grid>
        <Grid item sm={6}>
            <Container style={{ marginTop: "86px" }}>
                <img alt="UMass Chan Medical School" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAABlCAMAAACMReHqAAAA3lBMVEX///8AAAAAD58AAJ309foFBQX29vZnZ2fHx8eamprq6ur8/PylpaV5eXk0NDS1tbVQUFDKysoDG6dhYWHp6elQWLrb29uGhoYhISHT09NCQkK+vr4AAJjy8vKenp6UlJSvr69vb28qKioYGBg4ODiMjIxKSkpVVVU+Pj6kpKR8fHwTExMuLi7o6fNzc3MeHh7X2e/l5vV6fsVeY7q6veKEictobsE9RK8eJ6eeotaSl9HHyuirrttJUrktNKlRWLY3Pq69v+GMkc0XH6RxdsPLzemytd/a3PClqNgAAJCogr42AAAbkUlEQVR4nO1da4PattLGYTFgA4bimosxGJb7smy2bdqkado0TZq+//8PvdZ9RpaMN0ty6DnMp10sy5IeaTQ3jSqVK13pSle60pWudKUr/Ztpte6eorlbWMNv774/Re9uvlFv/rU0ag++4dfqzmnaF1XwtlqCrqAXkRv3a47zDT9YBnSnaX//5V/VFyfpCnoB9VYLMsa1b/jJUqA7U9vr99USmP9vg+5GUdTbtVq7OIoS/dlo0OFDfHmgOz3z2ze/lMHcBnq0ms3SIEgjSkH212w2g+PiTmezVhA0sqehfIkVXc1WUXHPsiJZuSiKg2A3WxXLJV+N/GC1qalhXLd3CPdUPbpA0M2o37wrhbkN9Nj0IQhleFvUpHlhx0JcWF9j34LcYG1o9nDW80SJ+O6iQe+E+Xf9H8phbl3p7UF9CT+ybg8GHijgzvaD+pAPymaQBntY/rZwqa/UKHePg/a3X+nJbswbcNjUV2lrcOwu+A/L+qznkzK+l14we3eccX7Yfp2Uw7xoT/fb6hOpsUTEcBasJn2Q5Yu0nEQWaxum6zcguYhXsRy5pDGQjRc/JosLBt3p+9qrb0qu82JBLtmKD6wsJRrkoeLlkWqS3iJAO1FmU3oozknJnH9+n1geyJmwv2TQ9T30bWnMi6V3MQo2YbFSIQ9jU5N31kr97ekyX5FGnGk/NPLPAg306UWD7szgi2+rZZn7CdCnonqrrFXDM6IhGzS2vqJkxLT0UJyPevzbW8/0tIFBb1026E6q3nv8vfxCLwa9KWq3ltBA76kGxbZXNrJIq/xYnItGXEkbWuZk+q8CXQ19SQX9a4M+tryhmIFVUvh6FHJ9wxlZCvj9fxXooh83fzwF868HumPYMwmphX5Cm/8aJMT2mbUEkUUlF7h80A9M//nxSZifGXRo0zkaXyCDKpZb90tG5TkkZJRFgWlgDDp0iaDfdtvNXSsN4jidzo63NTJDX5WX4b4O6B1h0nCMSnimBa1FtdsvHJgvpUhYXYOCQg0gjlwY6MPuPgg9OGH9JBo9RUH/WqC3pb3N5PYl1ttUmLUPTx2RZ1Kff/fBKLlz8rbKh3VRoG8CYeYMR3E8UpKo/3HyRNTPC/og2y6lZf1gWOqzjD+5YhOwidBfiUaiYcWyxFwJmJcD+rjJxirsDRacXx1mcu6+fP2f3NP3xMEvXRl5ccl9IL8Kw93Dt7XCSjurTXTP0aWAPm4wyHfzBfy5I/ehJ6J+XtA3ZL9U0lyueDaKtVCCXis9+ucgV4jud6Xn2mWAXmd60GiQfyR78meRKDcBVD0/6Euiqblyqadaab9DXTHSRG/R6io+c3yuV6ZZMZquyVfvuqsYo+c3VtQBdLueNgziueTu3dK7CgLdj/fEU7SdWaaqH1CZodM02qyzLvVdXg3RXsaWmIMc6OPYp33r1/QnaIALlLbqT/eSHqnH/bygO9TpLj0qXW3sA/Zcgm6RomM5a2q5yM8Idn7RB48b0BXcyYeRyYVSPs4RgO7H0mXgzEzepFFXPu/nBMWwteUyTiycus6dsR066E3aw3jjGEnZNH+zgl59Bap/Mzn/SneoOcuVjcKT3s+avq4Au1hqqrI3h91a4wFmW0c7DVpsGBToVGmorYJgQPe9fq5eOZx2y4xOCnSvDxvVzpWMUKOxYd9NmY+641U8VMwkUGLQ15Qd9FBkAyRl635r5e0/gNr/rH6FPZ3DIN/D5pcGL+wJVd5gfI/6uFvYxkMxHzOuPlpA0AcKDJ/YYOp6xa5ciUVaOiYO+h2MnTJVER2158oGHaZykS49vZo0/0kEep10z7NrcQu1ImygV9/fq8pv/voKoEccBmkFwYJy1v0uaaYnOGUuqDOZZ9JWZz9t1qWYOgR7X0hmy52oM5sBdwJ0av/dijGYGxZjePhi0IcE09qtip9i3ZCNHmRPDvNd8ziUBWSjZ+qlA0GvdmerhhFEeAfaYCTgm/7bzN6r3z2Cyn/mhc4KeiwsnHK5QgMNUeApP3LFY91SmwJMpiK+JlXP6QjW5Uh1JPP36TKW+3j0kDcCRxIRm/iYJzXgdRJj400lYFCWIP/zLSMQc1Wq+qM5ANk5pi5Z/OLf27xMqEC/JWNVsMyx+/qjBfQ/Qd3/iDJnBT0bpDGFQYXQgN0t48BL+lSCXscznQqAcqMT7jiwRWjzKOVfEx7TVD6pF4F+IlQXkAC9HvHvyH6pPtNmyhigHudxSsL0k0B8eSO+PBJzIz//JMi35BMjadM2EdhXb8yYT96Aql/KMIuzgp6txA2DVW5kyn0a3slNfC+mKgLdcxByPhdflJbMbH0bOZ4j54H/vdO+NTvvSle/zPQ6/AX+Mlc8llCU4zv+IclVkw86EKAvwgpQg4wEpf9XRtCrP4MiNyrM4qygDyTHlgYaFao7UN4toT1hb9deg2Sgg97QJrg3H/iwqKputEn1lkZSSnjyng6MM8J3LHfTVAOPN7oDQW/nfhMcwwr6gjB+FTVsojUYvM+vTcaZ6i9AiKt8UEXOCvpRzXnZtpT/kAzV3JS9QaDT/t4qg8tOH3IewraVReTrnLFI6c3PS0hSepQtOk150AW/kOIDAznUXzkBulBqraCPKsCwYKRbaJkyxlBUX3wGRaAif07QCVMXWpjiTGo0bkWvZb0IdILcAQxDbsiFTW2Rs3mJ8anbLazKTlhw/E+jEqAfNezSs4BOmJEMUDQT3KT+Nhphqz+BIvcwbvKcoBP9W4CuNCTWMfcANiFzwGWwnqdwFuSGPBGv1fTo5UA8uU2t8RFSo/giixynHOiNbj+FjTkL6IRdGs8YKYKRxJ//MoE++RUU8ZGZ9pygE1FNbpjypAQT0Ukf5DKUGBV6XPJDrnxMiyZi4JE6ZDW2bdlzUWJjnRenW5ADXadzgD73c0e/dIIWjnuji23yAVb7Bk2LM4AukSPiiRxy1Wr6vAstoxJ0a8hsNjejdm7I5Xt03CF2c/BgaIZdKt3lPbpPBz3KA/x00BOg1ZoJGnB9o6+l+h7W+lJ7+GzQlcmMgK622zpsIZF61S4k1V3rcYdk2hVWPTDkeCjG0FaHxuRoCo1RRUor6k8E3d3VhSXmOaCTH+XIGwnZN4wBctXX0BLnawHS5UC3DlP27EE+DJCLXG5KtYgu9I1qqQTd7PuIUmpgE8cjwRMlglNK1ZMGenBnaLArNwdzyKaBngJ6yDyri2eDTlSQRBl0DYQOkvxq1tDfwkr1eVEIusStCHTlUmpi1imdiCvM+IEbLu+uqnjxJtugF5sgMR0q8pQD08F1xmicTKhLRXFRcNAOUWnQk94me3DbbyW7Z4PuVYoN7koJIvTWLLhDIa7ySZ8XhaDL5WM7y0bkaeU1aGNzi/IpkfFGI20FPZqRUa21woolbsVFFosa5PDoxLlBWlPycIEokX2hISduSdDdGTUetqLK8wW5PqnZL7K+otBD86nFKnSnVm5yKUkKQZc6ki3HCZGslFCxxgGu6tDrfKiZRMQDzesdMoMlV/sswUohOEGtOV5hqIFBmpOzIud3hTRVPSoFesIaza1SzwV9TiD1CjBHXPfxvVGI+xGBmk9VUAi6ZMM21XaG+p+BvNSfCnpAmrUZ9B6d4DUBlzVCbaTkORxx66dqiazzrVVL3XoKt0IYbCr+LAN6tEVz7Lmg018KxDjkmDOfYKu+Rpj+lt8ACkH3xQ66NoeVUb+KGvaDNtQ+aCwW2cSvSCThBjcZWVEQltiQernmPfEV9zd0R04WQxoHQdGd8xT2HjIlQ3pcngs6fMFAdwhzs7L2+iWs69GQY6w4u5SccmYrCoFJRi5Uwgd96arG32LdWEwmGFfEQ1tkXIQJdPmtRCiEOZeZdFsa2qu0NmtOLqIzFbQgBzqbR0ptPQvocyvoqLs/Gzf0CRLcjRGTxaBLSc68C5LGKVWbOLWxZKbOM2qnXQToMCyGF1bu1pxjMzoqrpos4Sg05ophj/TXACm+abMFZm8vnwA6Vz4Vx+KgL58FutUygzD/YBbcf0NVvTFq8cV55KRoZGoe2SOBuE7+1U4fSwONZgQToENuxZ0mSwm6EAlkiQY8/cY36B5/FyzdvR104Lkyb+tkLqkJehp0PosUxxKNhuLWk0G3hcsg4dQcIFX9iGp6aTTLnwBdBosbUljRiDUw2GSIUlxEiE56dhmpbYOhFz0Vs0h+WpaI4C4RUePXgQ3uDn6BGWvN5+NV8qSOyfbg11GXToPOJ5jMphWJIK9nga7HWXJCcaSfjOlGqt9jPI3S/cmMkXJp5E6mUT8aTHFE+qaJ+ULh1JeVZCCAX4me8jGPpawmxy+B8iADnW87DTjKDPTU0iElZ+RjcZmZV715GnQxPLzfPWn1g9vHk0HXo2adfI8+vzAKcb9jOC1Jxk6mCZX7Sy2AIq9L83INAeZUStJPH7Pmb3QTmAzkBnq29MDPwtAbZVNAWN/3XjhlkDqOLlnzSdOA39gY56ikWGY024S4XT1mQ1RMdGYFXXADCc8qCkNiZhDTue95TdGE/VNBl/YRSMgedG9R1j6jeh6NkJcA3VcbTFee6ImmlEFDpTHUR4w1/8HUN5CwYmT4sUbPuO8i4b1YDHmPHbV7Mn/9EbwrZEi2paT2HkXgAA1orjwrpriPMCSDd/lEFBwNOHpoowfyIMdiIYUDvm4WSj8V1pci+4dGSN/wzUaZ6ktcjS1raImEwI0x/Ph6cxD+L+Hs8UdxIBlCtxXHYC4QvXkJFlQSx010YIOUZywEaae3DWC8F+DSv4Ow4octyNwzwMi/64ZXcSM2XsWnWAJgulsP0kYjTsHU5oeC45m09Ix3cZxU/DhW0SzzIKbcB8U03bXgGqFSRRSncmjWWTVkPOOZDIs+8mo0SnJnWtA6938oI7jbjzqVyQKdtJaG03PLVGCZayJAmSwNuHkG+YrEfuyBami0sLSgHfkaYUv00O2ysJy93G8i9sOyv6aSwEN6okfuqG/ObXuYi3TQeiRqBE5rMaJrLwEWf7qlSPmzT7m7HtxYYTEIgPD85OslWuBCWOU1pxtBoTIZPVozy5VM/T1qdmHQvrNoA5btro6ztCUo3R9nSLy7hbLAaN4+thAN2nPOsl2xkNaM6/pNbViSeK9aMYCyUgSW6nAGlWQbhcFMOxW4qLd6quGNWdaVgFH21yDjL/uW/CltpSs2Ar7Mq8EXAZ8tPFA3XqXqnVaL7EGDKaimNcN7X53/myD3Ed4GzN7UySssoZiDK54COgkw9eLpdNBut2fTXlLWOUmO9qWly2aoztqDNJK1R9m/O2Qy9cM0a8OgFeVa4I+m+3Z7lYal2+b7o8Z02qZdSiO3fJ+0RjdWWYNGyjLZ2rd3ZeadierCKezHMspQSwP7k1kNe6e1/x8r5v/bSf4vkDKGNRWzPOJH+rDy8+cLo4L+hwbkY0Gagivol0Vkl9pOE8p2/EqL5i9A2uejRUG/x/X4ZsP8FfRLJC6arOerWZsbKhDm92Zl7a9HrR7LKdYr6JdIObM7Ptlq8aD/pSnolrDoK+iXSTnQse/YfCJ58kmvpvhijyvol0U66FihMyvo1b/1WszhklfQL5Q00LHlxhLu/Eav5Ob74rRyV9AvizDoOGvDT+Z1/ipXyalksVfQL4sQ6CjM1GaUyWNuSUtxBf1SCYI+RL6Yz98Zzyl+zBsSjSFSV9AvlyDoKPTk0aiEoQQjnO6161yeGg17pW9NAHQkxFnCnQ3rvPJBwzyv2l9BvyxSoOPTGkbMJz8aarjXYiEnn3JC/xX0yyIJOj5Fbwx3xkfWZFEN4urbXKjcFfTLIgk6Cts0WtInebk9o5vv9PnxqXLzL1/po//EHczfkAToKILbeLuieZ3nRPfq74/5bb4Q9Gi/oheiox/DfSsI0oGIKfRoGUHpQEZ5+NM2CxBp7vdpoCVnrzTbU1b+iM+VNaY0NK6jZ3Mn5Mbd3GnUqD2gH5m1T+SHi5ok5q22nmvTJgqONHRqs4NxM+1BSlu3p8FpaZv1MesRejee0UiH9dSUkDBimaoXgxhGVDR4VSutKk4c9BqU3I3H0fJ2OEq5K9SrZN//6Smgj8YsVgspjDSi93YpZkK41U5Ti3Jum59VfliQIKfFOIbDXecPOwcIOs3u31mv10NyzbV+fJ2EU+lB1r0OizBZLIuDIdMH526zIvlBUGdCkrn/YbxeZ82pjevyxOySdXy4pcGXqy37924Lj/D0uuRGgfWYRPx29YjfkEyl7XpNXlzMVM9bSxaC3Vka7yLkoMMj2CbPWhXlCwOUT0BANoG3TwE9Q25O2gDb55F10UfLkJRZpHFGQQcdOKRhzSvPi3oUzSXSPBuk98jQSO817tO5EdJ7ubXG0HmS4+8uYQ2LE/FJPX6GalRDoAdkOu7IL36PRK2qw/YeqVXFLyRk1S6Qm5PEPM7IqywCt420J9K5PmEdIQ172oKP0gvIbXfScdBhbwyCe/W97ku1Fp6Qklpi8JN7OsWtBjCm0YopKkNW4JKB4R4gUj4o21houmdChhWG9noHKMCQnAa4Kezoc/7AKWE94+IIN1IZq7kFnZUErbXsW4pWGAlu7lv/rfhkgopJMCIth9eEkKMYIoKVrRs13+mJaUPiFUoMdBj8asgMWP3+3vJ6JbfQ6WH1J7H3ijiDoMByaTQ/Ds8k80Cc35hDpFw4QegJT5BPSgfdH+OKo5p2Czs71NLPnS1vnwZ9JIc9lO3h8dhqUfl1iMUJ0Feo8TTwWa1e0lV1lwk9hC2Pu7HDU7ZkRxR0eKORlg2MsvZ/rP3M+WRY9pl/vgj0oewBi/jFN1FA0GM4Mgh09qriczroZNltIfOe4+3Xr9eOuAZOJUBvypF0A5VaVpuFFQ/2qxh0gjJMyUvj24VEQFOSAuDodJfGltOgQ7kll/a1+ouNtVfySvqLF6SwHg1dAvRhDSCXzVqCFb5aRYHuJygXLwadojz30b8gj8dC4/bZwCIZIHTqHuY6nEqA3nYMSevILEOncf2NHWX8L2XusCH0CK+YsuSUBjzWU6EMXmwrp0EHFeuZhKqTVwWI5Yy1zDZ/r/96CvSGQ1UdMagNp0ui+TuIxyrQY/wAg87OAKlDqBj0ILeK3R4S2tJsOyeMsqM3sdxKz92jQL+Psy2E4PuFoIe5xs7BL2N9ajbglngadFCxFh81eUfzTNiypzxqKcAnLGDyyRa5wAmmYJ52nBhfLE9Igd52ikCnfVeSGgadHukoaskyqzuFS0ZQCdDZJjVAk4juw/aU0IWgN3NjQOcs03LIhbJOCh9SPiDSVZwGXXGfG2RIr1Y/UAmuaTNJPGpLmp10yh1xPQn6wAlIol/e4chZsMHKgx5mvD3Ts4pAp0dw5chpoFMJpqAhUe3AT6Xr/L0E6Pyc3HgHitEJZE8px1D2OWmgd3NjQHcexjcCuL8zIgqfyKhwEvQhAF3BVZ1Uf6AnkT2Q/0qjz9re/Zr+mrv24STom6z5lC1T5njMFmpkBF1QEej0XynQGEA3p49gNKUVkXdqGncrAbo8CF1TKDdNXEORIce+Ap3Mobt8V1nf4P1DnCDzPwk6yLch7+CoVt//Sle5nx7sl1Ng0Hmeqc9Pd61uM2mKwkwE24jcLRJp2w4bvrvuZrNZlABdAmsAPbddK/LHNAkt3Wq0xBZlQK8E4piq5BOr06DfbZeChgj0g3l+M6WthXstmlgadHi84e/JpFqdTCbv/maqObu+ycreMbb0qqacYbYE6HSJj3kfB2TIotxgEdCpcSbaPm+lF7D30OlMd9MdXX/aiJUCvRKJRDdiypRg7xvX45SsyoDOND4D6EfAtU+DDvWMx19/ePVGxLW7PCGKDfQboOBV+fVchvNNp0Enjl1mTiVZ/BMuuSLPnxLkVqdBl/YPDXR6CNneDshttdwi5UDP5Eh2NlmkjaXH3+3XPGiCXNPJ7emoFbRvrDeB4+gSIsF5XVqQ0/0LgmIxb62+JZUesvqaWedNkbGnQE/o1fbU2rBMdnQq08wfqE8K9OBQBPoIrS0N9Dl5aL3qwe862/F2ux0f8ky5LOjsQk7JZunktaeJLQR9lVvMYNOj0iY6akrHr7zKZk6k0VNRNXaH4scqpUzoY8AaUw2dAj1iOX4pK2wuKCj0qlSUGgFa5BBpoJOhUp4RDfSYcRNAPjhq3pPxwHSxoq+UBp1/ROyt1IeChJMEfLEQ9Cg3YYj1QihlOccQNTyVN84YMl+5oxPZjgX99PMfv7x/94EdaDRH1p0EPWaD7RIx6I51kzqcUKMx6Ilie5pFbotQ1kAPl/rUiYDEtpclKYtDECPQ/djALdyuGKa+Ap3ljEAsqw1wLASdThgUokwYFco5BSsmc00myMag+ynaJcRqxg4Zt4WzZhSHDtzc88H4ZDzueBr0HZdIWf6enmw0SgKLQW8rGRyDTutQb+m295a+1AcAW7UtBDnOikE32luGor07ADrz2oH9yIUMrBB0ZmcCpWmuMdEGvhuqpwQyua1h0HtYlpQsfMgTcvjhKMA3G5wEnffu07vJF2aXmnFWSg00LJ8/TaBkB90FwCHQyTjBvKA51+oG92cEZkisFgpllcgNj0BvGq+hGAts9zCRa4N4FUCG67lsa+UU6EywVJyoj3xjlPur0qTnwE+JXKvtB9ReEAI93LT3x/oG32ByCvQ/b2g6A//mtz9yuf1Lg34UO1ddfYv0FyXPpmYO3vZkDoaCgs6ZXvPOwRpSDnTK/msp/y+TF5Wtpg32E908TTmr8G/Et47JMN139rQAuPCVEGXwMiBkhgRJDfSZPtPJVx/4Pk0lxBQ8pMEZM96SUcYFjmqWUn96Xb6Ik4sU3aKsCH4K0/9V3/348eMfr6u2VX4S9CTMOjPshaTx2bo70EnkxWTzre08vkJ8j2nAw2naSluDmgIkYZdGP6S9XjAl7K8LoEo8Kkp3R2BLY5ckbIORF/aAXuxG2T/9yPNZpZQh9EXqLzfsUQ//nKaBqutZeThlC7zfCKPgoHmFWeL4VSPyIspExYRxvQZRExYB62XijcjTYeoBns3iZXqhF5ErJW6xxWhEBmkcRLwnYJ17KVVO9zTmrqPv3s8FndhyqPhuh/zFpBB0kfaO8OtsftIlq65F4q2N9BYdRIYwnMF60e1BONQ+BcXcuE9GpDYkWAz7nC9wKy+Vm1Sl/PO5mwqNLhQSzuY8ZHUvWnhOeOz+ldsh+e52rzYJQVSkUXkNIUQRvRv9gVTbyaUxc3eEkd2RnjzM9cAjO4Bzp3aaCth79bsSVAh6L24QYkkNgyHtlxc0GAkp2Y3juCEp+0dg6/di9WPc0LbaBn8YBxiFUXDsLpx1fxWo+954MxJYqfh8qH/ekhS219wMx/Mg/9Trtbrd2qI7T4EnN5JNpwx8JP/FqsEorq8fDt1Bw/TRpDHdjG+7xwD1PNLb+18e032lK13pSle60pWu9F9P/w/LBwVOu4Q8uwAAAABJRU5ErkJggg==" />
            </Container>
        </Grid>
    </Grid>
);
export default AboutUsPanel;
