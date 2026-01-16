---
title: "Ranking of MEPs by country and EU group still on X"
slug: "ranking-of-meps-still-on-x"
date: 2026-01-16
original_date: 2026-01-16
author: "Everton Zanella Alvarenga"
showTableOfContents: false
---

Despite repeated warnings about X’s growing moderation failures, disinformation risks, and instability, many Members of the European Parliament (MEPs) continue to rely on the platform for public communication. To better understand this landscape, we compiled a dataset of [all current MEPs](/politicians) and checked whether they still have an account on X.

The tables below show two rankings based on this data:
(1) by country, highlighting where representatives remain most active on X, and
(2) by EU political group, showing which groups still rely heavily on the platform.

These rankings are based on the proportion of each group’s members who continue to use X, not just absolute numbers, offering a clearer picture of where platform dependency remains strongest within the Parliament.

If you know of an inactive politician, we would be glad to update the statistics. Contact us  [leavex@pm.me](mailto:leavexeu%40pm.me?subject=Ideas%20for%20Leave%20X), [@leavex@mastodon.social](https://mastodon.social/@leavex), or [@leavex.bsky.social](https://bsky.app/profile/leavex.eu), and inform us of the X handle. If an MEP has declared that they quit X, we would appreciate an https://archive.is link to their post.

### MEPs by X usage status

Nearly 60% of MEPs still maintain an active account, while about 40% are not on the platform. Only one MEP is on X but currently inactive.

{{< chart >}}
type: 'bar',
data: {
  labels: [
    'MEPs'
  ],
  datasets: [
    {
      label: 'Still active on X (430)',
      data: [59.8],
      backgroundColor: 'rgba(220, 53, 69, 0.75)'
    },
    {
      label: 'On X but inactive (1)',
      data: [0.1],
      backgroundColor: 'rgba(255, 193, 7, 0.75)'
    },
    {
      label: 'Not on X (288)',
      data: [40.1],
      backgroundColor: 'rgba(40, 167, 69, 0.75)'
    }
  ]
},
options: {
  indexAxis: 'y',
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context) {
          return context.dataset.label + ': ' + context.parsed.x + '%';
        }
      }
    },
    legend: {
      position: 'bottom'
    }
  },
  scales: {
    x: {
      stacked: true,
      max: 100,
      ticks: {
        callback: function(value) {
          return value + '%';
        }
      }
    },
    y: {
      stacked: true
    }
  }
}
{{< /chart >}}
<!-- prettier-ignore-end -->


## Ranking by country (share of MEPs on X)

| Rank | Country | MEPs on X | Total MEPs | % on X |
| --- | --- | --- | --- | --- |
| 1 | Latvia | 9 | 9 | 100.0 |
| 2 | Croatia | 10 | 12 | 83.3 |
| 3 | Cyprus | 5 | 6 | 83.3 |
| 4 | Luxembourg | 5 | 6 | 83.3 |
| 5 | Slovenia | 7 | 9 | 77.8 |
| 6 | Spain | 45 | 60 | 75.0 |
| 7 | Denmark | 11 | 15 | 73.3 |
| 8 | Poland | 38 | 53 | 71.7 |
| 9 | Estonia | 5 | 7 | 71.4 |
| 10 | Germany | 64 | 96 | 66.7 |
| 11 | France | 54 | 81 | 66.7 |
| 12 | Finland | 10 | 15 | 66.7 |
| 13 | Czechia | 13 | 21 | 61.9 |
| 14 | Sweden | 13 | 21 | 61.9 |
| 15 | Netherlands | 19 | 31 | 61.3 |
| 16 | Belgium | 13 | 22 | 59.1 |
| 17 | Greece | 11 | 21 | 52.4 |
| 18 | Ireland | 7 | 14 | 50.0 |
| 19 | Malta | 3 | 6 | 50.0 |
| 20 | Bulgaria | 8 | 17 | 47.1 |
| 21 | Austria | 9 | 20 | 45.0 |
| 22 | Italy | 33 | 76 | 43.4 |
| 23 | Romania | 14 | 33 | 42.4 |
| 24 | Slovakia | 6 | 15 | 40.0 |
| 25 | Portugal | 8 | 21 | 38.1 |
| 26 | Lithuania | 4 | 11 | 36.4 |
| 27 | Hungary | 6 | 21 | 28.6 |

## Ranking by EU group (share of MEPs on X)

| Rank | EU group | MEPs on X | Total MEPs | % on X |
| --- | --- | --- | --- | --- |
| 1 | Group of the European People's Party (Christian Democrats) | 168 | 188 | 89.4 |
| 2 | Group of the Greens/European Free Alliance | 34 | 53 | 64.2 |
| 3 | Renew Europe Group | 45 | 75 | 60.0 |
| 4 | Group of the Progressive Alliance of Socialists and Democrats in the European Parliament | 75 | 136 | 55.1 |
| 5 | European Conservatives and Reformists Group | 38 | 79 | 48.1 |
| 6 | The Left group in the European Parliament - GUE/NGL | 20 | 46 | 43.5 |
| 7 | Patriots for Europe Group | 35 | 85 | 41.2 |
| 8 | Non-attached Members | 9 | 30 | 30.0 |
| 9 | Europe of Sovereign Nations Group | 6 | 27 | 22.2 |

### Distribution of MEPs active on X by EU group

This chart shows the share of all MEPs still active on X, broken down by EU political group. It does not represent internal percentages within each group.

{{< chart >}}
type: 'pie',
data: {
  labels: [
    "Europe of Sovereign Nations",
    "Non-attached",
    "The Left (GUE/NGL)",
    "Group of the Greens / EFA",
    "Patriots for Europe",
    "ECR",
    "Renew Europe",
    "S&D",
    "EPP (Christian Democrats)"
  ],
  datasets: [{
    label: 'Share of MEPs on X by EU group',
    data: [6, 9, 20, 34, 35, 38, 45, 75, 168],
    backgroundColor: [
      'rgba(214, 51, 132, 0.75)',
      'rgba(32, 201, 151, 0.75)',
      'rgba(111, 66, 193, 0.75)',
      'rgba(25, 135, 84, 0.75)',
      'rgba(253, 126, 20, 0.75)',
      'rgba(108, 117, 125, 0.75)',
      'rgba(13, 110, 253, 0.75)',
      'rgba(255, 193, 7, 0.75)',
      'rgba(220, 53, 69, 0.75)'
    ],
    borderWidth: 0,
    hoverOffset: 4
  }]
},
options: {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context) {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const value = context.parsed;
          const pct = (value / total * 100).toFixed(1);
          return context.label + ': ' + pct + '% (' + value + ' MEPs)';
        }
      }
    },
    legend: { position: 'bottom' }
  }
}
{{< /chart >}}
<!-- prettier-ignore-end -->


