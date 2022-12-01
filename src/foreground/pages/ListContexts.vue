<template>
  <main class="toolbar-layout contexts">
    <nav class="toolbar">
      <router-link class="btn btn--text" to="/contexts/new"><i class="bi-plus-square-dotted" /> {{ $t('page.contexts.addcontext') }}</router-link>
    </nav>
    <section class="view">
      <h4>{{ $t('page.contexts.choosecontext') }}</h4>
      <table>
        <thead>
          <tr>
            <th>{{ $t('page.contexts.name') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <template v-if="contexts && contexts.length">
            <tr v-for="context of contexts" :key="context.name">
              <td>
                <router-link :to="'/contexts/' + context.name"><i class="bi-box" /> {{ context.name }}</router-link>
              </td>
              <td class="actions">
                <button class="btn btn--text" @click="pinContext(context)">
                  <i class="bi-pin-angle" />
                </button>
                <button class="btn btn--text" @click="deleteContext(context)">
                  <i class="bi-trash" />
                </button>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td><i>{{ $t('page.contexts.nocontexts') }}</i></td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

<script>
export default {
  data() {
    return {
      contexts: null
    }
  },
  methods: {
    async loadContexts() {
      this.contexts = await api.listContexts();
    },

    async pinContext(context) {
      await api.addPin({
        name: `Context: ${ context.name }`,
        path: `/contexts/${ context.name }`
      });
    },

    async deleteContext(context) {
      await api.deleteContext(context.name);
      await this.loadContexts();
    }
  },
  mounted() {
    this.loadContexts();
  }
}
</script>

<style lang="scss">
.contexts.toolbar-layout {
  .view {
    padding: 10vh 20vw;

    @media (max-width: 1000px) {
      padding-left: 5vw;
      padding-right: 5vw;
    }

    @media (max-width: 600px) {
      padding-left: 20vw;
      padding-right: 20vw;
    }

    @media (max-height: 1000px) {
      padding-top: 5vh;
      padding-bottom: 5vh;
    }

    @media (max-height: 800px) {
      padding-top: 2vh;
      padding-bottom: 2vh;
    }

    table {
      width: 100%;
      border-collapse: collapse;

      thead {
        th {
          text-align: left;
          padding: .5rem;
        }
      }

      tbody {
        tr {
          td {
            padding: .5rem;

            &.actions {
              text-align: right;

              .btn {
                color: inherit;
              }
            }
          }
        }
      }
    }
  }
}
</style>
